# NextPhases.dev - Team Portfolio

Professional portfolio website for NextPhases.dev, a software development team specializing in scalable solutions for startups, freelancers, and businesses.

## 🌙 Features

- **Animated Moon Phase Background** - Dynamic, smooth moon phase animations representing growth and transformation
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations** - Scroll-triggered animations for engaging user experience
- **Contact Form** - Integrated contact form with validation and user feedback
- **Modern UI** - Clean, professional design with attention to detail
- **SEO Optimized** - Proper meta tags and semantic HTML for search engine visibility

## 🚀 Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables and animations
- **Vanilla JavaScript** - No dependencies, lightweight and fast
- **Font Awesome** - Icon library for visual elements
- **Canvas API** - For moon phase animations

## 📁 Project Structure

```
team-portfolio/
├── index.html          # Main HTML file
├── style.css           # All styles and animations
├── script.js           # JavaScript functionality
├── favicon.png         # Site favicon (moon icon)
├── logo.png            # NextPhases full logo
└── README.md           # This file
```

## 🎨 Color Palette

- **Primary Dark**: `#555354` - Main brand color (charcoal gray)
- **Primary Darker**: `#3a3939` - Hover states and accents
- **Secondary Light**: `#c4c3c3` - Subtle text and borders
- **Background Light**: `#f5f5f5` - Page background
- **Text Dark**: `#2a2929` - Primary text color

## 🛠️ Setup & Deployment

### Local Development

1. Clone the repository
2. Open `index.html` in a browser
3. That's it! No build process needed.

### Deployment Options

**Option 1: GitHub Pages (Recommended)**
1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select main branch and root folder
4. Your site will be live at `https://yourusername.github.io/team-portfolio`

**Option 2: Netlify**
1. Create account at netlify.com
2. Drag and drop your project folder
3. Site goes live instantly with custom domain support

**Option 3: Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts for instant deployment

## 📧 Contact Form Integration

The contact form is ready for backend integration. Choose one:

### Option 1: FormSpree (Easiest - Recommended to start)
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Replace the form submission code in `script.js` with Formspree endpoint
4. Free tier: 50 submissions/month

### Option 2: EmailJS
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Configure email service and template
3. Add EmailJS SDK to `index.html`
4. Uncomment EmailJS code in `script.js`
5. Free tier: 200 emails/month

### Option 3: Netlify Forms
1. Add `netlify` attribute to form tag
2. Deploy to Netlify
3. Forms automatically handled

### Option 4: Custom Backend
Create your own API endpoint and modify the `simulateFormSubmission` function in `script.js`.

## 🎯 Future Enhancements

**Phase 1** (Current)
- [x] Animated background
- [x] Contact form
- [x] Responsive design
- [x] Basic animations

**Phase 2** (Next)
- [ ] Portfolio/case studies section
- [ ] Blog integration
- [ ] Team member profiles
- [ ] Client testimonials
- [ ] Project showcase gallery

**Phase 3** (Future)
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Performance analytics
- [ ] Live chat integration
- [ ] Interactive service pricing calculator

## 📊 Performance

- **Lighthouse Score**: 95+ (aim for)
- **Load Time**: < 2 seconds
- **First Contentful Paint**: < 1.5s
- **No external dependencies** (except Font Awesome CDN)

## 🔒 Security Notes

- Form includes basic client-side validation
- Server-side validation required for production
- Implement rate limiting on form submissions
- Use HTTPS for all deployments
- Sanitize all user inputs on backend

## 📱 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile Safari: iOS 12+
- Chrome Android: Latest

## 🤝 Contributing

This is a private team portfolio. For internal contributions:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request for review
5. Merge after team approval

## 📄 License

© 2025 NextPhases.dev - All Rights Reserved

This is proprietary software. Unauthorized copying, modification, or distribution is prohibited.

## 📞 Contact

- **Email**: team@nextphases.dev
- **Website**: [nextphases.dev](https://nextphases.dev)
- **Location**: Lusaka, Zambia

---

**Built with ❤️ by the NextPhases.dev team**

*Engineering your next phase of success*