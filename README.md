# ArmaCareFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Application Features

### Authentication and Security

- JWT-based authentication with automatic token refresh
- Role-based access control (ROLE_ADMIN, ROLE_PROFESSIONAL)
- Secure password handling with appropriate hashing
- Form validation on both client and server sides

### Professional Management

- Registration with document upload (identity, diplomas, licenses)
- Profile management for professionals
- Dashboard with personal information and status

### Admin Features

- First administrator creation process
- Admin management interface for creating additional administrators
- Professional validation workflow
- Secure admin dashboard with navigation between sections

For more detailed information on administrator features, please refer to the [Administrator Guide](./GUIDE_ADMIN.md).

## Documentation

- [User Manual](./USER_MANUAL.md): Comprehensive guide for all users
- [Administrator Guide](./GUIDE_ADMIN.md): Specific guide for system administrators
- [Developer Documentation](./DEVBOOK.md): Technical documentation for developers
