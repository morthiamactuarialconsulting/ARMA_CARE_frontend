# Architecture Standalone d'ARMA-CARE

## Vue d'ensemble

ARMA-CARE a été migré vers une architecture entièrement standalone, suivant les meilleures pratiques Angular modernes. Cette architecture offre plusieurs avantages :

- **Performances améliorées** : Chargement plus rapide et meilleure expérience utilisateur
- **Sécurité renforcée** : Contrôles d'accès explicites à chaque niveau
- **Maintenabilité accrue** : Structure plus claire et moins de complexité
- **Optimisation SEO** : Compatibilité avec le rendu côté serveur (SSR)
- **Modules réduits** : Élimination complète des NgModules traditionnels

## Structure de l'application

### Composants Standalone

Tous les composants de l'application sont maintenant configurés en mode standalone, ce qui signifie qu'ils :
- Déclarent explicitement leurs dépendances
- Peuvent être chargés paresseusement (lazy loading)
- Sont plus faciles à tester
- Facilitent le tree-shaking

### Séparation des responsabilités UI

Nous avons appliqué une architecture UI qui sépare clairement les différentes responsabilités :

1. **Tableau de bord professionnel** :
   - Concentration sur les statuts et actions immédiates
   - Design épuré et focalisé sur l'essentiel

2. **Composant de profil** :
   - Composant standalone dans `/shared/profile`
   - Gestion des informations détaillées utilisateur
   - Accessible globalement via la barre de navigation

3. **Barre de navigation** :
   - Composant global avec statut d'authentification
   - Menu utilisateur personnalisé avec affichage des informations nominatives

### Système de Routes

Le système de routes a été remanié pour utiliser le chargement paresseux des composants au lieu des modules :

```typescript
{
  path: 'professional',
  children: [
    {
      path: 'dashboard',
      loadComponent: () => import('./professional/components/dashboard/dashboard.component')
        .then(c => c.ProfessionalDashboardComponent),
      canActivate: [() => professionalGuard()]
    }
  ]
}
```

### Mesures de Sécurité

Conformément aux exigences strictes de sécurité d'ARMA-CARE, les mesures suivantes ont été implémentées :

1. **Vérifications de rôles renforcées** :
   - Vérification explicite des rôles utilisateur avant redirection
   - Normalisation des rôles pour éviter les erreurs de casse ou d'espaces
   - Utilisation cohérente du préfixe 'ROLE_' (ex: 'ROLE_PROFESSIONAL')

2. **Validation de session** :
   - Vérification rigoureuse de l'état des sessions utilisateur
   - Journalisation des violations de sécurité
   - Rafraîchissement automatique des données utilisateur
   - Gestion adaptée des environnements serveur et navigateur

3. **Contrôle d'accès** :
   - Guards fonctionnels pour chaque zone protégée
   - Vérifications multiples des autorisations
   - Protection CSRF activée

4. **Journalisation de sécurité** :
   - Enregistrement détaillé des tentatives d'accès non autorisées
   - Horodatage et contexte complet des violations

## Avantages pour ARMA-CARE

Cette architecture répond spécifiquement aux besoins d'une application médicale manipulant des données sensibles :

- **Isolation** : Chaque composant fonctionne de manière isolée
- **Transparence** : Les dépendances sont explicites
- **Robustesse** : Moins de risques d'erreurs dues aux dépendances cachées

## Maintenance future

Pour maintenir et étendre cette architecture :

1. Chaque nouveau composant doit être créé en standalone
2. Utiliser `loadComponent` pour le chargement paresseux
3. Maintenir des vérifications de sécurité explicites dans tous les nouveaux composants
4. Suivre le modèle établi pour les guards et les contrôles d'accès

## Compatibilité SSR (Server-Side Rendering)

La migration vers l'architecture standalone a été complétée par une optimisation pour le Server-Side Rendering (SSR), offrant des avantages significatifs :

### Bénéfices du SSR

- **Chargement initial plus rapide** : Le HTML est déjà généré côté serveur
- **Amélioration SEO** : Les moteurs de recherche voient le contenu complet
- **Meilleure expérience utilisateur** : Contenu visible plus rapidement

### Adaptations pour SSR

1. **Gestion des références à window et document** :
   ```typescript
   @Inject(PLATFORM_ID) private platformId: Object
   private isBrowser = isPlatformBrowser(this.platformId);
   
   // Utilisation sécurisée
   if (this.isBrowser) {
     // Code accédant à window ou document
   }
   ```

2. **Gestion des redirections** :
   - Utilisation conditionnelle de router.navigate() ou window.location.href
   - Compatibilité avec les environnements serveur et client

3. **Architecture hybride** :
   - Hydratation client-side avec `provideClientHydration()`
   - Fonctionnalités dégradées intelligemment en absence de navigateur

## Intégration Backend/Frontend

L'architecture standalone a nécessité une attention particulière à l'intégration avec le backend :

### Structure de réponse d'authentification

Le backend renvoie une structure précise pour assurer une authentification efficace :

```json
{
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "username": "user@example.com",
  "roles": ["ROLE_PROFESSIONAL", "ROLE_USER"],
  "id": 42,
  "email": "user@example.com"
}
```

Cette structure est parfaitement alignée avec l'interface `AuthResponse` du frontend :

```typescript
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  roles: string[];
  id?: number;
  email?: string;
}
```

### Génération de tokens JWT

Le backend inclut les rôles utilisateur directement dans le payload JWT, facilitant la vérification des autorisations même sans connexion au serveur. Cette approche améliore la sécurité et les performances.
