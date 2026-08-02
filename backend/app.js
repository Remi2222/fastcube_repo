const express = require('express');
const cors = require('cors');
const path = require('path');

// Import des routes
const authRoutes = require('./routes/auth.routes');
const blogsRoutes = require('./routes/blogs.routes');
const commentairesRoutes = require('./routes/commentaires.routes');
const contactsRoutes = require('./routes/contacts.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const newsletterRoutes = require('./routes/newsletter.routes');
const partenairesRoutes = require('./routes/partenaires.routes');
const propositionsRoutes = require('./routes/propositions.routes');
const searchRoutes = require('./routes/search.routes');
const servicesRoutes = require('./routes/services.routes');
const solutionsRoutes = require('./routes/solutions.routes');
const tendersRoutes = require('./routes/tenders.routes');
const testimonialsRoutes = require('./routes/testimonials.routes');
const ticketsRoutes = require('./routes/tickets.routes');
const usersRoutes = require('./routes/users.routes');
const recommendationsRoutes = require('./routes/recommendations.routes');
const healthRoutes = require('./routes/health.routes');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount routes under /api
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/commentaires', commentairesRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/partenaires', partenairesRoutes);
app.use('/api/propositions', propositionsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/solutions', solutionsRoutes);
app.use('/api/tenders', tendersRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/health', healthRoutes);

// Basic health route
app.get('/', (req, res) => {
    res.json({
        message: 'FastCube API Server',
        version: '1.0.0',
        status: 'running'
    });
});

const distPath = path.join(__dirname, '..', 'dist');
if (require('fs').existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

module.exports = app;




