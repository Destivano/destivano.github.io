# Personal Portfolio Website

A modern, responsive personal portfolio website built with vanilla JavaScript, HTML5, and CSS3. Perfect for showcasing your projects, skills, and professional experience.

## ✨ Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Typewriter Effect**: Dynamic text animation in the hero section
- **Project Filter**: Interactive project filtering by category
- **Smooth Scrolling**: Enhanced navigation experience
- **Contact Form**: Functional contact form (ready for backend integration)
- **Scroll Animations**: Elements animate as they come into view
- **Mobile Navigation**: Hamburger menu for mobile devices
- **SEO Friendly**: Semantic HTML structure
- **No Dependencies**: Pure vanilla JavaScript - no frameworks or libraries needed

## 🚀 Quick Start

1. **Clone or download** this repository to your local machine

2. **Customize the content**:
   - Edit `index.html` to update your personal information
   - Modify `styles.css` to change colors and styling
   - Update `script.js` if you need additional functionality

3. **Replace placeholder content**:
   - Add your profile picture (replace the placeholder image URL)
   - Update project images and descriptions
   - Add your real contact information
   - Update social media links

4. **Test locally**:
   - Open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

## 📦 GitHub Pages Deployment

### Option 1: Direct Repository Method

1. **Create a new GitHub repository** named `yourusername.github.io` (replace `yourusername` with your GitHub username)

2. **Upload your files**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Personal portfolio website"
   git branch -M main
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git push -u origin main
   ```

3. **Access your site** at: `https://yourusername.github.io`

### Option 2: Project Repository Method

1. **Create a new repository** with any name (e.g., `portfolio`)

2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/portfolio.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **main** branch
   - Click **Save**

4. **Access your site** at: `https://yourusername.github.io/portfolio`

## 🎨 Customization Guide

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    /* ... more colors */
}
```

### Content Sections

#### Hero Section
- Update your name in `index.html`
- Modify the typewriter phrases in `script.js`:
```javascript
const phrases = [
    'Your Title 1',
    'Your Title 2',
    'Your Title 3'
];
```

#### About Section
- Replace the placeholder image
- Update your bio and information

#### Skills Section
- Add/remove skill cards
- Update technology tags

#### Projects Section
- Add your projects with images
- Update project descriptions and links
- Modify filter categories as needed

#### Contact Section
- Add your real email and contact information
- Connect to a backend service (see below)

### Contact Form Backend Integration

The contact form is ready for backend integration. Here are some options:

1. **FormSpree** (Easiest):
   ```html
   <form action="https://formspree.io/f/your-form-id" method="POST">
   ```

2. **EmailJS** (No backend needed):
   - Sign up at emailjs.com
   - Add their library and configure

3. **Custom Backend**:
   - Modify the fetch request in `script.js`
   - Connect to your API endpoint

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 File Structure

```
personal-portfolio/
├── index.html          # Main HTML file
├── styles.css          # All styling
├── script.js           # JavaScript functionality
└── README.md          # This file
```

## 🛠️ Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript (ES6+)
- No external dependencies!

## 💡 Tips

1. **Images**: Optimize your images before uploading (use tools like TinyPNG)
2. **SEO**: Update meta tags in `index.html` for better search engine visibility
3. **Analytics**: Add Google Analytics if you want to track visitors
4. **Custom Domain**: You can use a custom domain with GitHub Pages
5. **SSL**: GitHub Pages provides free SSL (HTTPS)

## 📝 License

This project is open source and available under the MIT License. Feel free to use it for your personal portfolio!

## 🤝 Contributing

Feel free to fork this project and customize it for your needs. If you have suggestions for improvements, please open an issue or submit a pull request.

## 📧 Support

If you have questions or need help, feel free to open an issue in the repository.

---

**Built with ❤️ using Vanilla JavaScript**

Deployed on GitHub Pages 🚀
