# 🏗️ Clean Architecture Reference

## Architecture Layers

### 1. Core Layer (Business Logic)
**Location**: `src/core/`

#### Domain (`core/domain/`)
- **Entities**: Pure business models (TypeScript interfaces)
- **Repositories**: Contracts (interfaces) for data access
- **Rule**: No dependencies on outer layers

#### Use Cases (`core/usecases/`)
- **Services**: Application business logic
- **Rule**: Can depend on domain, not on infrastructure or presentation

### 2. Infrastructure Layer (External Services)
**Location**: `src/infrastructure/`

#### Purpose
- Implements repository interfaces
- Handles external API calls
- Firebase integration
- **Rule**: Depends on core domain, implements repository interfaces

### 3. Presentation Layer (UI)
**Location**: `src/presentation/`

#### Components
- **UI Components**: Reusable, atomic components
- **Sections**: Feature-specific components
- **Pages**: Route-level components
- **Rule**: Only depends on core layer through services

### 4. Shared Layer
**Location**: `src/shared/`

#### Contains
- **Types**: Shared TypeScript interfaces
- **Constants**: Configuration and constants
- **Utils**: Helper functions
- **Rule**: No dependencies, can be used by all layers

## Data Flow

```
User Interaction (Presentation)
        ↓
    Service Call (Use Cases)
        ↓
    Repository Interface (Domain)
        ↓
    Repository Implementation (Infrastructure)
        ↓
    External API (Firebase)
```

## Dependency Rule

```
Presentation → Use Cases → Domain
                            ↑
Infrastructure ─────────────┘
```

**Key Principle**: Dependencies point inward. Inner layers don't know about outer layers.

## Adding New Features

### 1. Add Entity (if needed)
```typescript
// src/core/domain/entities/
export interface NewFeature {
  id?: string;
  name: string;
  // ...fields
}
```

### 2. Add Repository Interface
```typescript
// src/core/domain/repositories/
export interface INewFeatureRepository extends BaseRepository<NewFeature> {
  // custom methods
}
```

### 3. Implement Repository
```typescript
// src/infrastructure/repositories/
export class FirebaseNewFeatureRepository implements INewFeatureRepository {
  // implement methods
}
```

### 4. Add Service Methods
```typescript
// src/core/usecases/services.ts
async getAllNewFeatures(): Promise<NewFeature[]> {
  const data = await this.newFeatureRepo.getAll();
  return data.length > 0 ? data : fallbackConfig;
}
```

### 5. Create UI Component
```typescript
// src/presentation/components/sections/
export const NewFeatureSection: React.FC = () => {
  // use service to fetch data
  // render UI
}
```

## Benefits

1. **Testability**: Each layer can be tested independently
2. **Maintainability**: Clear separation of concerns
3. **Scalability**: Easy to add new features
4. **Flexibility**: Easy to swap implementations (e.g., change from Firebase to REST API)
5. **Type Safety**: Full TypeScript support throughout

## Migration Example

### Switching from Firebase to REST API

1. **Keep Everything The Same Except**:
   - Create new implementation in `infrastructure/repositories/`
   ```typescript
   export class RestApiNewFeatureRepository implements INewFeatureRepository {
     async getAll(): Promise<NewFeature[]> {
       const response = await fetch('/api/features');
       return response.json();
     }
   }
   ```

2. **Update Service Initialization**:
   ```typescript
   // src/core/usecases/index.ts
   const newFeatureRepo = new RestApiNewFeatureRepository(); // Changed this line only!
   ```

3. **Everything Else Works**: UI, business logic, types - all remain unchanged!

This is the power of Clean Architecture! 🎯
