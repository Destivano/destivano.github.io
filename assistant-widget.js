/**
 * Personal AI Assistant — floating widget.
 *
 * Vanilla JS, no build step, no dependencies — matches the rest of this
 * static site. Talks to the FastAPI backend's /api/chat endpoint; the API
 * base URL comes from assistant-config.js (loaded before this file).
 *
 * The Groq key never appears here: the browser only ever calls this
 * project's own backend, which holds the key server-side. All cost/abuse
 * limits (session cap, rate limits, off-topic refusal) are enforced by the
 * backend — this file only *displays* what the server reports, it cannot
 * relax or bypass any of it.
 */
(function () {
  "use strict";

  var CONFIG = window.PERSONAL_ASSISTANT_CONFIG || {};
  var API_BASE = (CONFIG.apiBase || "").replace(/\/$/, "");
  var MAX_CHARS = 1500;
  var HISTORY_TURNS = 6;
  var SESSION_KEY = "personalAssistant.session.v1";

  var STARTERS = [
    "What projects has he worked on?",
    "What did he do at CEA List?",
    "What Generative AI projects has he built?",
    "What research has he published?",
    "Why would he be a good AI Engineer candidate?",
    "How can I contact him?",
  ];

  // Badge text shown above an answer. Deliberately written for a recruiter, not
  // for whoever built this: the visitor has no use for the words "structured",
  // "RAG" or "retrieval", and naming internal machinery in the UI is a small
  // leak of implementation detail. The API still reports the real route for
  // logs and tests - only the display text is translated. An unrecognised route
  // renders no badge at all rather than a raw enum value.
  var ROUTE_LABEL = {
    structured: "from his portfolio data",
    tool: "from his portfolio data",
    rag: "sourced answer",
    refused: "",
    degraded: "quoted directly from his portfolio",
  };

  // ------------------------------------------------------------- utilities

  function createSessionId() {
    if (window.crypto && window.crypto.randomUUID) {
      return "s-" + window.crypto.randomUUID().replace(/-/g, "").slice(0, 24);
    }
    var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    var out = "";
    for (var i = 0; i < 24; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return "s-" + out;
  }

  function loadSession() {
    try {
      var raw = window.sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && parsed.sessionId && Array.isArray(parsed.turns)) return parsed;
    } catch (err) {
      /* sessionStorage unavailable (private mode etc.) - fall back to memory only */
    }
    return null;
  }

  function saveSession(state) {
    try {
      window.sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ sessionId: state.sessionId, turns: state.turns })
      );
    } catch (err) {
      /* ignore - conversation just won't survive a reload */
    }
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // --------------------------------------------------------------- API call

  function postChat(payload) {
    return fetch(API_BASE + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(function (response) {
      return response.json().catch(function () {
        return null;
      }).then(function (body) {
        if (!response.ok) {
          var detail = body && body.error ? body.error : { code: "unknown", message: "Something went wrong." };
          var err = new Error(detail.message || "Request failed.");
          err.code = detail.code;
          err.retryAfterSeconds = detail.retry_after_seconds;
          err.status = response.status;
          throw err;
        }
        return body;
      });
    });
  }

  // ------------------------------------------------------------------- init

  function init() {
    var root = document.getElementById("ai-assistant");
    if (!root) return;

    var toggle = document.getElementById("ai-assistant-toggle");
    var panel = document.getElementById("ai-assistant-panel");
    var closeBtn = document.getElementById("ai-assistant-close");
    var log = document.getElementById("ai-assistant-log");
    var suggestionsBox = document.getElementById("ai-assistant-suggestions");
    var form = document.getElementById("ai-assistant-form");
    var input = document.getElementById("ai-assistant-input");
    var sendBtn = document.getElementById("ai-assistant-send");
    var meta = document.getElementById("ai-assistant-meta");
    var resizeX = document.getElementById("ai-assistant-resize-x");
    var resizeY = document.getElementById("ai-assistant-resize-y");

    var restored = loadSession();
    var state = {
      sessionId: (restored && restored.sessionId) || createSessionId(),
      turns: (restored && restored.turns) || [],
      busy: false,
      exhausted: false,
      opened: false,
    };

    if (!API_BASE) {
      meta.textContent = "Assistant is not configured (missing apiBase in assistant-config.js).";
    }

    // ----------------------------------------------------------- rendering

    function renderCitation(citation) {
      var href = citation.anchor || citation.url;
      if (!href) {
        var span = document.createElement("span");
        span.className = "ai-assistant-citation";
        span.textContent = citation.title;
        return span;
      }
      var a = document.createElement("a");
      a.className = "ai-assistant-citation";
      a.href = href;
      a.textContent = citation.title;
      a.title = "Source: " + citation.source_type + " / " + citation.entity_id;
      if (citation.url && !citation.anchor) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      } else {
        // Same-page anchor: jump there and get out of the way so the
        // visitor can actually see the section, per the "preserve the
        // portfolio behind the assistant" requirement.
        a.addEventListener("click", function () {
          setTimeout(closePanel, 120);
        });
      }
      return a;
    }

    function renderTurn(turn) {
      var wrap = document.createElement("div");
      wrap.className = "ai-assistant-msg " + (turn.role === "user" ? "user" : "bot");

      var label = turn.role === "assistant" && turn.route ? ROUTE_LABEL[turn.route] : "";
      if (label) {
        var who = document.createElement("span");
        who.style.display = "flex";
        who.style.alignItems = "center";
        who.style.gap = "0.4rem";
        who.style.fontSize = "0.68rem";
        who.style.color = "var(--text-light)";
        var badge = document.createElement("span");
        badge.className = "ai-assistant-route";
        badge.setAttribute("data-route", turn.route);
        badge.textContent = label;
        who.appendChild(badge);
        wrap.appendChild(who);
      }

      var bubble = document.createElement("div");
      bubble.className = "ai-assistant-bubble";
      bubble.textContent = turn.content;
      wrap.appendChild(bubble);

      if (turn.citations && turn.citations.length) {
        var citeWrap = document.createElement("div");
        citeWrap.className = "ai-assistant-citations";
        turn.citations.forEach(function (c) {
          citeWrap.appendChild(renderCitation(c));
        });
        wrap.appendChild(citeWrap);
      }

      return wrap;
    }

    function renderIntro() {
      var p = document.createElement("p");
      p.className = "ai-assistant-intro";
      p.innerHTML =
        "Hi! I&rsquo;m Mohamed&rsquo;s personal AI assistant. Ask me about his " +
        "projects, research, experience, skills, publications, or what he&rsquo;s " +
        "currently looking for. Answers are grounded in his own portfolio data " +
        "and cited &mdash; I&rsquo;ll say so if I don&rsquo;t know something.";
      return p;
    }

    function renderLog() {
      log.innerHTML = "";
      if (state.turns.length === 0) {
        log.appendChild(renderIntro());
      } else {
        state.turns.forEach(function (turn) {
          log.appendChild(renderTurn(turn));
        });
      }
      log.scrollTop = log.scrollHeight;
    }

    function renderSuggestions() {
      suggestionsBox.innerHTML = "";
      if (state.turns.length > 0) return;
      STARTERS.forEach(function (starter) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "ai-assistant-chip";
        btn.textContent = starter;
        btn.disabled = state.busy || state.exhausted;
        btn.addEventListener("click", function () {
          send(starter);
        });
        suggestionsBox.appendChild(btn);
      });
    }

    function setMeta(text) {
      meta.textContent = text;
    }

    function setBusyUI(busy) {
      state.busy = busy;
      input.disabled = busy || state.exhausted;
      sendBtn.disabled = busy || state.exhausted;
      renderSuggestions();
    }

    // --------------------------------------------------------------- send

    function send(message) {
      var trimmed = (message || "").trim();
      if (!trimmed || state.busy || state.exhausted) return;

      state.turns.push({ role: "user", content: trimmed });
      renderLog();
      renderSuggestions();
      saveSession(state);
      setBusyUI(true);

      var thinking = document.createElement("div");
      thinking.className = "ai-assistant-thinking";
      thinking.innerHTML =
        '<span class="ai-assistant-thinking-dot"></span><span>thinking&hellip;</span>';
      log.appendChild(thinking);
      log.scrollTop = log.scrollHeight;

      var history = state.turns
        .slice(0, -1)
        .slice(-HISTORY_TURNS)
        .map(function (t) {
          return { role: t.role, content: t.content };
        });

      postChat({ session_id: state.sessionId, message: trimmed, history: history })
        .then(function (data) {
          state.turns.push({
            role: "assistant",
            content: data.answer,
            route: data.route,
            citations: data.citations || [],
          });
          saveSession(state);
          if (data.usage) {
            setMeta(
              data.usage.messages_remaining +
                " message" +
                (data.usage.messages_remaining === 1 ? "" : "s") +
                " left in this conversation"
            );
            if (data.usage.messages_remaining <= 0) state.exhausted = true;
          }
        })
        .catch(function (err) {
          var friendly =
            err && err.status
              ? err.message
              : "The assistant is unreachable right now. The portfolio above is complete, and the Contact section has direct ways to get in touch.";
          var errBox = document.createElement("p");
          errBox.className = "ai-assistant-error";
          errBox.textContent = friendly;
          log.appendChild(errBox);
          log.scrollTop = log.scrollHeight;
          if (err && (err.code === "session_limit_reached" || (err.retryAfterSeconds && err.retryAfterSeconds > 3600))) {
            state.exhausted = true;
          }
        })
        .finally(function () {
          renderLog();
          setBusyUI(false);
        });
    }

    // ------------------------------------------------------------- panel

    function openPanel() {
      panel.hidden = false;
      root.setAttribute("data-state", "open");
      toggle.setAttribute("aria-expanded", "true");
      if (!state.opened) {
        state.opened = true;
        renderLog();
        renderSuggestions();
      }
      window.setTimeout(function () {
        input.focus();
      }, 50);
    }

    function closePanel() {
      panel.hidden = true;
      root.setAttribute("data-state", "closed");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      if (panel.hidden) openPanel();
      else closePanel();
    });
    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !panel.hidden) closePanel();
    });

    // ---------------------------------------------------------- resizing
    // The panel is anchored by its right/bottom edges (see
    // assistant-widget.css), so growing it from the left/top edge is a
    // manual drag rather than the browser's native corner-only `resize`.
    // Bounds mirror the CSS min/max-width/height so this can never fight
    // the stylesheet's limits.

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function startDrag(handle, axis, cssClass) {
      handle.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        var startX = event.clientX;
        var startY = event.clientY;
        var rect = panel.getBoundingClientRect();
        var startWidth = rect.width;
        var startHeight = rect.height;
        var maxWidth = Math.min(720, window.innerWidth - 48);
        var maxHeight = Math.min(860, window.innerHeight - 40);
        handle.classList.add("is-active");
        document.body.classList.add(cssClass);

        function onMove(moveEvent) {
          if (axis === "x") {
            var deltaX = startX - moveEvent.clientX; // dragging left grows it
            panel.style.width = clamp(startWidth + deltaX, 320, maxWidth) + "px";
          } else {
            var deltaY = startY - moveEvent.clientY; // dragging up grows it
            panel.style.height = clamp(startHeight + deltaY, 420, maxHeight) + "px";
          }
        }

        function onUp() {
          handle.classList.remove("is-active");
          document.body.classList.remove(cssClass);
          document.removeEventListener("pointermove", onMove);
          document.removeEventListener("pointerup", onUp);
        }

        document.addEventListener("pointermove", onMove);
        document.addEventListener("pointerup", onUp);
      });
    }

    if (resizeX) startDrag(resizeX, "x", "ai-assistant-resizing-x");
    if (resizeY) startDrag(resizeY, "y", "ai-assistant-resizing-y");

    // -------------------------------------------------------------- form

    function submitDraft() {
      var value = input.value;
      input.value = "";
      input.style.height = "auto";
      send(value);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitDraft();
    });

    input.addEventListener("keydown", function (event) {
      // Enter sends; Shift+Enter adds a newline.
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitDraft();
      }
    });

    input.addEventListener("input", function () {
      if (input.value.length > MAX_CHARS) input.value = input.value.slice(0, MAX_CHARS);
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 90) + "px";
    });

    // ---------------------------------------------------- restore on load

    if (state.turns.length > 0) {
      state.opened = true;
      renderLog();
      renderSuggestions();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
