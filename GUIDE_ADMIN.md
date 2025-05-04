# Guide de l'Administrateur ARMA-CARE

## Table des matières

1. [Introduction](#introduction)
2. [Création du premier administrateur](#création-du-premier-administrateur)
3. [Gestion des administrateurs](#gestion-des-administrateurs)
4. [Validation des professionnels](#validation-des-professionnels)
5. [Bonnes pratiques de sécurité](#bonnes-pratiques-de-sécurité)

## Introduction

Ce guide est destiné aux administrateurs de la plateforme ARMA-CARE. Il présente les fonctionnalités spécifiques à l'administration du système, y compris la création et la gestion des comptes administrateurs ainsi que la validation des professionnels de santé.

## Création du premier administrateur

Lors du premier démarrage du système ARMA-CARE, aucun administrateur n'existe. Le système détecte automatiquement cette situation et redirige vers l'interface de création du premier administrateur.

### Processus de création

1. Accédez à l'application ARMA-CARE.
2. Si aucun administrateur n'existe dans le système, vous serez automatiquement redirigé vers la page de création du premier administrateur.
3. Remplissez le formulaire avec les informations suivantes :
   - Nom
   - Prénom
   - Adresse e-mail professionnelle
   - Mot de passe (respectant les règles de sécurité)
   - Confirmation du mot de passe
4. Cliquez sur "Créer Administrateur" pour valider la création.

### Recommandations de sécurité

- Utilisez une adresse e-mail professionnelle dédiée.
- Créez un mot de passe fort (minimum 12 caractères, avec des majuscules, minuscules, chiffres et caractères spéciaux).
- Ne partagez jamais vos identifiants d'administrateur.
- Utilisez l'authentification à deux facteurs si disponible.

## Gestion des administrateurs

Une fois connecté en tant qu'administrateur, vous pouvez créer d'autres comptes administrateurs pour distribuer les responsabilités de gestion.

### Accès à la gestion des administrateurs

1. Connectez-vous avec vos identifiants administrateur.
2. Accédez au tableau de bord administrateur.
3. Cliquez sur l'onglet "Administrateurs" dans le menu de navigation principal.

### Ajout d'un nouvel administrateur

1. Dans la section Administrateurs, cliquez sur "Ajouter un administrateur".
2. Remplissez le formulaire avec les informations du nouvel administrateur :
   - Nom
   - Prénom
   - Adresse e-mail professionnelle
   - Mot de passe (respectant les règles de sécurité)
   - Confirmation du mot de passe
3. Cliquez sur "Ajouter" pour créer le compte.

### Bonnes pratiques

- Limitez le nombre d'administrateurs au strict nécessaire.
- Révisez régulièrement la liste des administrateurs pour vous assurer que tous les comptes sont actifs et légitimes.
- Formez les nouveaux administrateurs aux procédures de sécurité.

## Validation des professionnels

L'une des principales responsabilités des administrateurs est la validation des comptes des professionnels de santé.

### Processus de validation

1. Accédez à l'onglet "Professionnels" dans le tableau de bord administrateur.
2. Consultez la liste des professionnels en attente de validation (onglet "En attente").
3. Pour chaque dossier, vérifiez :
   - L'identité du professionnel
   - Les diplômes et qualifications
   - Les licences professionnelles
   - Les autres documents fournis
4. Décidez d'une action :
   - **Activer** : Valide la demande du professionnel et rend son compte utilisable (statut ACTIVE)
   - **Rejeter** : Refuse la demande d'inscription avec indication d'un motif (statut REJECTED)

### Gestion des comptes professionnels

En tant qu'administrateur, vous pouvez gérer le cycle de vie complet des comptes professionnels. Les différents statuts possibles sont :

| Statut | Description | Actions possibles |
|--------|-------------|-------------------|
| PENDING_VERIFICATION | En attente de vérification | Activer, Rejeter |
| ACTIVE | Compte validé et utilisable | Suspendre, Désactiver |
| REJECTED | Demande refusée | Activer (après correction) |
| SUSPENDED | Temporairement suspendu | Réactiver, Désactiver |
| INACTIVE | Définitivement désactivé | Aucune (ou Activer dans certains cas exceptionnels) |

### Actions de gestion des comptes

- **Suspendre un compte** : Permet de suspendre temporairement l'accès d'un professionnel au système en cas de doute ou d'enquête. Une raison doit être fournie.
- **Désactiver un compte** : Désactive définitivement le compte d'un professionnel qui ne pratique plus ou a commis une faute grave. Une raison doit être fournie.

### Contrôles de sécurité recommandés

- Vérifiez l'authenticité des documents fournis.
- Consultez les registres professionnels officiels lorsque c'est possible.
- En cas de doute, demandez des informations complémentaires.

## Bonnes pratiques de sécurité

En tant qu'administrateur ARMA-CARE, vous êtes responsable de la sécurité du système.

### Recommandations générales

- Changez votre mot de passe régulièrement (tous les 3 mois recommandé).
- Utilisez une session privée ou effacez votre historique après utilisation sur un poste partagé.
- Déconnectez-vous systématiquement après chaque session.
- Surveillez les journaux d'activité pour détecter toute activité suspecte.
- Signalez immédiatement toute anomalie ou suspicion de faille de sécurité.

### Gestion des incidents

En cas de suspicion d'accès non autorisé ou de compromission de compte :

1. Changez immédiatement le mot de passe du compte concerné.
2. Informez le responsable de la sécurité informatique.
3. Vérifiez les actions récentes effectuées avec ce compte.
4. Documentez l'incident et les mesures prises.

## Conclusion

Ce guide présente les principales fonctionnalités administratives d'ARMA-CARE. Pour toute question ou assistance, veuillez contacter le support technique à support@arma-care.com.

---

*Document mis à jour le : Juin 2024*
