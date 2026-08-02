# Moteur de Recommandations - Documentation

## Vue d'ensemble

Le moteur de recommandations de FastCube utilise des algorithmes de filtrage basés sur le contenu (content-based) pour suggérer des services pertinents aux utilisateurs en fonction de leur comportement et de leurs préférences.

## Architecture

### Composants principaux

1. **Table `user_actions`** - Stockage des interactions utilisateur
2. **Modèles Node.js** - Gestion des données et algorithmes
3. **API REST** - Endpoints pour les recommandations
4. **Composant React** - Interface utilisateur

### Algorithmes implémentés

- **Content-based** : Basé sur la dernière action de l'utilisateur
- **History-based** : Basé sur l'historique des vues
- **Hybrid** : Combinaison des deux approches (recommandé)

## Installation et Configuration

### 1. Créer la table MySQL

```bash
# Exécuter le script de configuration
node backend/scripts/setup-recommendations.js
```

### 2. Démarrer le serveur

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

## API Endpoints

### GET /api/recommendations/:userId

Récupérer les recommandations pour un utilisateur.

**Paramètres :**
- `userId` (string) : ID de l'utilisateur
- `algorithm` (query) : Type d'algorithme ('content', 'history', 'hybrid')
- `limit` (query) : Nombre maximum de recommandations (1-20)

**Exemple :**
```bash
curl "http://localhost:5000/api/recommendations/user_1?algorithm=hybrid&limit=5"
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "userId": "user_1",
    "algorithm": "hybrid",
    "recommendations": [
      {
        "id": 12,
        "title": "Audit Cybersécurité",
        "description": "Évaluation complète...",
        "category": "Cybersécurité",
        "image_url": null,
        "view_count": 15
      }
    ],
    "count": 1,
    "generated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### POST /api/recommendations/actions

Enregistrer une action utilisateur.

**Body :**
```json
{
  "user_id": "user_1",
  "action_type": "view",
  "item_id": 123,
  "item_type": "service",
  "metadata": {
    "source": "services_page",
    "duration": 30
  }
}
```

**Types d'actions supportés :**
- `view` : Consultation d'un élément
- `click` : Clic sur un élément
- `search` : Recherche
- `like` : Like/ajout aux favoris
- `share` : Partage
- `download` : Téléchargement

### GET /api/recommendations/actions/:userId

Récupérer l'historique des actions d'un utilisateur.

**Paramètres de requête :**
- `action_type` : Filtrer par type d'action
- `item_type` : Filtrer par type d'élément
- `limit` : Nombre maximum d'actions (défaut: 50)

### GET /api/recommendations/stats/:userId

Récupérer les statistiques de recommandations.

## Utilisation Frontend

### Composant RecommendationsSection

```jsx
import RecommendationsSection from '../components/RecommendationsSection';

<RecommendationsSection 
  userId="user_1"
  title="🔮 Vous pourriez aimer..."
  limit={6}
  algorithm="hybrid"
  className="py-12"
/>
```

### Hook useRecommendations

```jsx
import { useRecommendations } from '../hooks/useRecommendations';

const MyComponent = () => {
  const {
    recommendations,
    loading,
    error,
    trackAction,
    refreshRecommendations
  } = useRecommendations('user_1', {
    algorithm: 'hybrid',
    limit: 5,
    autoFetch: true
  });

  const handleServiceClick = (serviceId) => {
    trackAction('click', serviceId, 'service', {
      source: 'my_component'
    });
  };

  // ... reste du composant
};
```

## Tests

### Test des recommandations

```bash
# Exécuter les tests
node backend/scripts/test-recommendations.js
```

### Test manuel via API

```bash
# 1. Enregistrer une action
curl -X POST http://localhost:5000/api/recommendations/actions \
  -H "Content-Type: application/json" \
  -d '{"user_id":"user_1","action_type":"view","item_id":1}'

# 2. Récupérer les recommandations
curl "http://localhost:5000/api/recommendations/user_1?algorithm=hybrid&limit=5"
```

## Personnalisation

### Ajouter de nouveaux types d'actions

1. Modifier la liste `validActionTypes` dans `recommendations.controller.js`
2. Mettre à jour la documentation

### Modifier l'algorithme de recommandation

1. Éditer `recommendations.model.js`
2. Ajouter de nouveaux critères dans `getHybridRecommendations()`

### Ajouter de nouveaux types d'éléments

1. Modifier la liste `validItemTypes` dans `recommendations.controller.js`
2. Adapter les requêtes SQL si nécessaire

## Monitoring et Performance

### Métriques importantes

- Nombre d'actions enregistrées par jour
- Taux de clic sur les recommandations
- Temps de réponse des endpoints
- Utilisation mémoire des algorithmes

### Optimisations possibles

- Mise en cache des recommandations fréquentes
- Indexation des colonnes de recherche
- Nettoyage automatique des anciennes actions
- Mise en place de Redis pour le cache

## Dépannage

### Problèmes courants

1. **Aucune recommandation** : Vérifier que l'utilisateur a des actions enregistrées
2. **Erreur de connexion DB** : Vérifier la configuration MySQL
3. **Recommandations identiques** : Ajuster l'algorithme ou ajouter plus de données

### Logs utiles

```bash
# Logs du serveur
tail -f backend/logs/app.log

# Logs de la base de données
tail -f /var/log/mysql/error.log
```

## Roadmap

- [ ] Intégration avec le système d'authentification
- [ ] Recommandations en temps réel avec WebSockets
- [ ] Machine Learning avancé avec TensorFlow.js
- [ ] A/B testing des algorithmes
- [ ] Dashboard d'analytics des recommandations
