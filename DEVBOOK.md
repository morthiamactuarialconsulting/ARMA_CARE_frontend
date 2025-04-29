# DEVBOOK - Guide de développement ARMA-CARE Frontend

Ce document est un guide de référence pour le développement du frontend Angular d'ARMA-CARE. Il contient des informations essentielles sur la structure du projet, la configuration, et les procédures de développement.

## Table des matières

1. [Structure du projet](#structure-du-projet)
2. [Architecture Standalone](#architecture-standalone)
3. [Configuration des environnements](#configuration-des-environnements)
4. [Système d'authentification](#système-dauthentification)
5. [Compatibilité SSR (Server-Side Rendering)](#compatibilité-ssr)
6. [Téléchargement de documents](#téléchargement-de-documents)
7. [Page d'accueil et Tiers-payant](#page-daccueil-et-tiers-payant)
8. [Routes et gardes](#routes-et-gardes)
9. [Services principaux](#services-principaux)
10. [Connexion avec le backend](#connexion-avec-le-backend)
11. [Procédures de développement](#procédures-de-développement)
12. [Déploiement](#déploiement)
13. [Journal des modifications](#journal-des-modifications)

## Structure du projet

Le projet ARMA-CARE Frontend est structuré selon une architecture standalone, sans modules NgModule traditionnels. Cette organisation favorise la modularité, les performances et la maintenabilité :

- **auth/** : Composants d'authentification (login, register, reset password)
- **admin/** : Interface d'administration pour la gestion des professionnels
- **professional/** : Interface pour les professionnels de santé 
- **shared/** : Services, guards, modèles partagés et composants communs
  - **profile/** : Composant de gestion du profil utilisateur (accessible depuis la navbar)
- **components/** : Composants réutilisables de l'application

```
src/
├── app/
│   ├── admin/               # Fonctionnalités d'administration
│   │   └── components/      # Composants standalone d'administration
│   ├── auth/                # Fonctionnalités d'authentification
│   │   └── components/      # Composants standalone d'authentification
│   ├── professional/        # Fonctionnalités pour professionnels
│   │   └── components/      # Composants standalone pour professionnels
│   ├── shared/              # Éléments partagés
│   │   ├── guards/          # Gardes de route fonctionnels
│   │   ├── interceptors/    # Intercepteurs HTTP
│   │   ├── models/          # Interfaces et types
│   │   └── services/        # Services injectés
│   ├── components/          # Composants standalone partagés
│   ├── app.component.ts     # Composant racine (standalone)
│   ├── app.routes.ts        # Configuration des routes
│   └── app.config.ts        # Configuration de l'application
├── assets/                  # Ressources statiques
├── environments/            # Configuration des environnements
└── styles.scss              # Styles globaux
```

## Architecture Standalone

ARMA-CARE a été complètement migré vers l'architecture standalone d'Angular, éliminant la nécessité des modules NgModule traditionnels. Cette approche moderne offre plusieurs avantages :

### Caractéristiques principales

- **Composants autonomes** : Chaque composant déclare ses propres dépendances avec `standalone: true`
- **Lazy loading optimisé** : Chargement à la demande via `loadComponent` au lieu de `loadChildren`
- **Injection simplifiée** : Services déclarés avec `providedIn: 'root'`
- **Performance améliorée** : Tree-shaking plus efficace et bundles plus petits
- **Maintenance facilitée** : Réduction des dépendances implicites

### Exemple de composant standalone

```typescript
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // ...
}
```

### Configuration des routes

Les routes utilisent `loadComponent` au lieu de `loadChildren` :

```typescript
const routes: Routes = [
  {
    path: 'professional',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./professional/components/dashboard/dashboard.component')
          .then(c => c.ProfessionalDashboardComponent)
      }
    ]
  }
];
```

## Configuration des environnements

Le projet utilise des fichiers d'environnement pour la configuration selon le contexte de déploiement:

### environment.ts (Développement)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  tokenExpirationTime: 15 * 60 * 1000, // 15 minutes en millisecondes
  refreshTokenExpirationTime: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
};
```

### environment.prod.ts (Production)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api-production-url.com/api', // À configurer selon l'environnement
  tokenExpirationTime: 15 * 60 * 1000,
  refreshTokenExpirationTime: 7 * 24 * 60 * 60 * 1000,
};
```

## Système d'authentification

Le système d'authentification d'ARMA-CARE utilise JWT (JSON Web Tokens) pour gérer les sessions utilisateurs. Il a été optimisé pour être compatible avec le Server-Side Rendering (SSR).

### Fonctionnement

1. **Processus d'authentification** :
   - L'utilisateur saisit ses identifiants (username/email et mot de passe)
   - Le frontend envoie une requête POST au backend (`/api/auth/login`)
   - Le backend authentifie l'utilisateur et renvoie un objet contenant :
     - `accessToken` : token JWT principal
     - `refreshToken` : token pour rafraîchir la session
     - `username` : identifiant de l'utilisateur
     - `roles` : tableau des rôles attribués à l'utilisateur
     - `id` : identifiant numérique de l'utilisateur (facultatif)
     - `email` : adresse email de l'utilisateur (facultatif)

2. **Gestion des rôles** :
   - Les rôles sont stockés dans le token JWT et dans le sessionStorage
   - Les principaux rôles sont `ROLE_PROFESSIONAL` et `ROLE_ADMIN`
   - La méthode `hasRole()` vérifie si l'utilisateur possède un rôle spécifique

3. **Redirection basée sur les rôles** :
   - Après connexion, les utilisateurs sont redirigés vers différentes interfaces selon leur rôle
   - Priorité donnée au tableau de bord professionnel pour les utilisateurs avec `ROLE_PROFESSIONAL`

### Sécurité

Le système d'authentification intègre plusieurs mesures de sécurité :

- **Vérification stricte des rôles** avant accès aux zones protégées
- **Validation des tokens** pour détecter les sessions expirées ou corrompues
- **Protection CSRF** configurée dans app.config.ts
- **Journalisation de sécurité** des tentatives d'accès non autorisées

## Compatibilité SSR

L'application a été optimisée pour le Server-Side Rendering (SSR), ce qui améliore les performances et le référencement.

### Adaptations pour SSR

1. **Vérification de l'environnement d'exécution** :
   - Injection de `PLATFORM_ID` et utilisation de `isPlatformBrowser()` pour détecter l'environnement
   - Vérification systématique avant d'accéder à `window` ou `document`

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false; // Côté serveur, retourner false
    
    // Vérification côté client
    const token = window.sessionStorage.getItem(this.TOKEN_KEY);
    return !!token;
  }
}
```

2. **Gestion des redirections** :
   - Utilisation de `router.navigate()` côté serveur
   - Possibilité d'utiliser `window.location.href` côté client pour les redirections complètes

3. **Configuration SSR** :
   - Activation de l'hydratation côté client dans `app.config.ts`
   - Gestion des états transitoires pour éviter les différences de rendu

Le système d'authentification est basé sur JWT (JSON Web Tokens) et comprend les fonctionnalités suivantes:

### Endpoints d'authentification

| Endpoint | Méthode | Description | Données attendues |
|----------|---------|-------------|------------------|
| `/api/auth/login` | POST | Connexion utilisateur | `{ username, password }` |
| `/api/auth/register-with-files` | POST | Inscription avec documents | FormData (multipart) |
| `/api/auth/refresh` | POST | Rafraîchissement du token | `{ refreshToken }` |
| `/api/auth/change-password` | POST | Changement de mot de passe | `{ currentPassword, newPassword, confirmPassword }` |
| `/api/auth/forgot-password` | POST | Mot de passe oublié | `{ email }` |
| `/api/auth/reset-password` | POST | Réinitialisation du mot de passe | `{ token, newPassword, confirmPassword }` |

### Processus d'authentification

1. **Inscription**: Le professionnel s'inscrit avec ses informations personnelles et télécharge ses documents (CNI, diplôme, licence).
2. **Vérification**: Un administrateur vérifie les documents et approuve ou rejette l'inscription.
3. **Connexion**: Après approbation, le professionnel peut se connecter et accéder aux fonctionnalités.

### Gestion des tokens

Le service `AuthService` gère les tokens d'authentification:

- Les tokens sont stockés dans `sessionStorage` (accessToken et refreshToken)
- Un intercepteur HTTP ajoute automatiquement le token à chaque requête
- Le token expiré est automatiquement rafraîchi lorsqu'une requête reçoit une réponse 401

## Téléchargement de documents

Le système permet le téléchargement de documents lors de l'inscription des professionnels.

### Types de documents

- **Pièce d'identité** (obligatoire): CNI, passeport
- **Diplôme** (obligatoire): Diplôme médical
- **Licence professionnelle** (obligatoire): Licence d'exercice
- **Assurance professionnelle** (facultatif): Attestation d'assurance

### Processus de téléchargement

1. L'utilisateur sélectionne les fichiers à télécharger via le formulaire d'inscription
2. Le service `FileService` prépare un objet FormData pour l'envoi
3. Les fichiers sont envoyés avec les données d'inscription au endpoint `/api/auth/register-with-files`
4. Le backend stocke les fichiers et renvoie les chemins d'accès pour référence future

## Page d'accueil et Tiers-payant

La page d'accueil (HomeComponent) intègre maintenant toutes les fonctionnalités de présentation d'ARMA-CARE, notamment une mise en avant du système de tiers-payant.

### Structure de la page d'accueil

```
- Section Hero : présentation principale avec appel à l'action
- Section À propos : explication du concept ARMA-CARE
- Section Fonctionnalités : présentation des services offerts
- Section Tiers-payant : explication du système de tiers-payant avec schéma
- Section Contact pour assurances : formulaire de contact dédié aux assurances
- Section FAQ : questions fréquentes sur le service
- Section Professionnels : avantages pour les professionnels de santé
- Section CTA : appel à l'action pour s'inscrire
```

### Intégration du formulaire de contact pour assurances

Le formulaire de contact dédié aux assurances est intégré dans le HomeComponent :

```typescript
// Formulaire de contact pour les assurances
this.contactForm = this.formBuilder.group({
  companyName: ['', Validators.required],
  contactName: ['', Validators.required],
  position: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', Validators.required],
  message: ['', Validators.required],
  gdpr: [false, Validators.requiredTrue]
});
```

### FAQ sur le tiers-payant

La section FAQ intègre les questions fréquemment posées sur le système du tiers-payant :

```typescript
// Questions fréquentes sur le tiers-payant
this.faqItems = [
  {
    question: 'Comment fonctionne le système de tiers-payant ?',
    answer: 'Le système de tiers-payant permet aux patients de ne pas avancer les frais médicaux. ARMA-CARE facilite la gestion de ce processus en automatisant les demandes de remboursement entre les professionnels de santé et les assurances.'
  },
  // Autres questions...
];
```

### Ressources graphiques

Les ressources graphiques nécessaires pour la page d'accueil sont stockées dans le répertoire `assets/img/` :

- Logo ARMA-CARE
- Illustrations pour les sections Tiers-payant
- Photos pour la section Professionnels
- Icônes pour les fonctionnalités

## Routes et gardes

### Routes principales

```typescript
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'professional',
    loadChildren: () => import('./professional/professional.module').then(m => m.ProfessionalModule)
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  }
];
```

### Gardes de route

Le système utilise trois gardes pour protéger les routes:

- **authGuard**: Vérifie si l'utilisateur est connecté
- **adminGuard**: Vérifie si l'utilisateur est connecté et a le rôle ADMIN
- **professionalGuard**: Vérifie si l'utilisateur est connecté et a le rôle PROFESSIONAL

## Services principaux

### AuthService

Service central pour la gestion de l'authentification:

```typescript
class AuthService {
  login(credentials: LoginRequest): Observable<AuthResponse>;
  registerWithFiles(formData: FormData): Observable<AuthResponse>;
  refreshToken(): Observable<AuthResponse>;
  logout(): void;
  isLoggedIn(): boolean;
  getToken(): string | null;
  hasRole(role: string): boolean;
  // ...
}
```

### FileService

Service pour la gestion des fichiers:

```typescript
class FileService {
  getDocument(category: string, professionalId: number, filename: string): Observable<Blob>;
  prepareRegistrationFormData(professionalData: any, files: { [key: string]: File }): FormData;
  downloadDocument(blob: Blob, filename: string): void;
  // ...
}
```

## Connexion avec le backend

La communication avec le backend est configurée via les services Angular et l'intercepteur HTTP.

### Configuration CORS

Le backend est configuré pour accepter les requêtes CORS du frontend Angular:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.addAllowedOrigin("http://localhost:4200");
        config.setAllowCredentials(true);
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.addExposedHeader("Authorization");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### Intercepteur HTTP

L'intercepteur HTTP (`AuthInterceptor`) ajoute le token JWT à chaque requête et gère le rafraîchissement automatique:

```typescript
class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ajouter le token JWT aux requêtes non-auth
    if (!this.isAuthRequest(request)) {
      const token = this.authService.getToken();
      if (token) {
        request = this.addTokenHeader(request, token);
      }
    }
    
    // Gérer les erreurs 401 (token expiré)
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }
  
  // ...
}
```

## Procédures de développement

### Installation et démarrage

1. Cloner le dépôt:
   ```bash
   git clone <url-du-repo>
   cd arma-care-frontend
   ```

2. Installer les dépendances:
   ```bash
   npm install
   ```

3. Démarrer le serveur de développement:
   ```bash
   ng serve
   ```
   L'application sera disponible à l'adresse `http://localhost:4200`.

### Création de nouvelles fonctionnalités

1. Créer un nouveau composant:
   ```bash
   ng generate component path/to/component-name --standalone
   ```

2. Créer un nouveau service:
   ```bash
   ng generate service path/to/service-name
   ```

3. Créer une nouvelle interface:
   ```bash
   ng generate interface path/to/interface-name
   ```

### Tests

1. Exécuter les tests unitaires:
   ```bash
   ng test
   ```

2. Exécuter les tests end-to-end:
   ```bash
   ng e2e
   ```

## Déploiement

### Construction pour la production

```bash
ng build --configuration production
```

Les fichiers de construction seront générés dans le répertoire `dist/`.

### Serveur de production recommandé

Pour le déploiement en production, nous recommandons d'utiliser un serveur NGINX configuré pour servir l'application Angular et rediriger les appels API vers le backend.

Exemple de configuration NGINX:

```nginx
server {
    listen 80;
    server_name armacare.example.com;

    root /var/www/arma-care-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend-server:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

*Ce document sera régulièrement mis à jour pour refléter les évolutions du projet ARMA-CARE Frontend.*

## Composants UI Principaux

### Tableau de bord professionnel

Le tableau de bord professionnel a été simplifié pour se concentrer sur deux éléments essentiels :

1. **Carte de statut du compte** :
   - Affiche l'état actuel du compte (En attente, Vérifié, Rejeté, Suspendu)
   - Présente un message contextuel adapté au statut
   - Utilise un code couleur intuitif pour chaque état

2. **Carte d'actions rapides** :
   - Fournit des accès directs aux fonctionnalités fréquemment utilisées
   - Permet une navigation rapide et efficace dans l'application

Cette simplification améliore l'expérience utilisateur en fournissant uniquement les informations essentielles et les actions fréquentes.

### Composant de profil

Un nouveau composant de profil a été créé pour centraliser la gestion des informations personnelles et professionnelles des utilisateurs :

1. **Informations personnelles** :
   - Nom complet du professionnel
   - Spécialité médicale
   - Numéro RPPS

2. **Coordonnées** :
   - Email professionnel (utilise le username)
   - Numéro de téléphone
   - Adresse complète (rue, ville, pays)

Ce composant est accessible via l'option "Mon profil" dans la barre de navigation, permettant aux utilisateurs d'accéder facilement à leurs informations personnelles depuis n'importe quelle page de l'application.

### Barre de navigation

La barre de navigation a été améliorée pour :

1. **Afficher les informations nominatives** :
   - Priorité donnée au prénom et nom de l'utilisateur
   - Affichage de l'initiale dans l'avatar

2. **Menu déroulant de profil** :
   - Accès direct au profil utilisateur
   - Navigation vers le tableau de bord approprié selon le rôle
   - Option de déconnexion sécurisée

La conception responsive garantit une expérience cohérente sur tous les appareils.

## Journal des modifications

### 29 avril 2025

- **Réorganisation UI majeure**:
  - Création d'un nouveau composant `ProfileComponent` accessible depuis la navbar
  - Simplification du tableau de bord professionnel pour se concentrer sur le statut et les actions rapides
  - Déplacement des informations détaillées du professionnel vers la page de profil dédiée
  - Amélioration visuelle de la barre de navigation

- **Optimisations de l'authentification**:
  - Mise à jour de l'interface `AuthResponse` pour inclure de nouveaux champs venant du backend
  - Amélioration de la sauvegarde des données utilisateur pour inclure tous les champs disponibles
  - Correction de l'affichage des informations nominatives (prénom, nom, email)

- **Améliorations d'accessibilité**:
  - Ajout d'un padding-top pour éviter que le contenu soit masqué par la navbar fixe
  - Optimisation de la mise en page pour une meilleure expérience sur tous les appareils

### 26 avril 2025
- **Amélioration de la section Hero** :
  - Implémentation correcte de l'image d'arrière-plan avec `background-attachment: fixed`
  - Ajustement de l'overlay pour une meilleure visibilité (opacité réduite à 0.048)
  - Amélioration des cartes de fonctionnalités avec effets de transparence et flou d'arrière-plan
  - Optimisation du responsive design pour les tablettes et mobiles
  - Centrage des éléments avec Flexbox pour une meilleure présentation

### 25 avril 2025

- **Mise à jour majeure de la page d'accueil** : Intégration des sections présentant le système de tiers-payant, d'un formulaire de contact pour les assurances et d'informations destinées aux professionnels de santé.
- **Suppression du composant LandingPage** : Consolidation de tout le contenu dans le composant HomeComponent existant.
- **Amélioration de la structure des routes** : Modification de la redirection vers le HomeComponent.
- **Création du répertoire assets/img** : Ajout d'un espace dédié pour les ressources graphiques nécessaires à la page d'accueil.
