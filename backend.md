# Velvet Rose — Backend Design Document

## Database Schema (SQLite + Drizzle ORM)

### Table: `users`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | integer | PK, autoIncrement | |
| email | text | notNull, unique | |
| name | text | notNull | |
| passwordHash | text | | nullable — for local auth users |
| role | text | notNull, default "user" | enum: "user", "admin" |
| oauthProvider | text | | nullable — "kimi" for OAuth users |
| oauthId | text | | nullable — external OAuth ID |
| createdAt | integer (timestamp) | default now | |

### Table: `products`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | integer | PK, autoIncrement | |
| name | text | notNull | |
| description | text | | |
| price | integer | notNull | stored in cents |
| imageUrl | text | | |
| category | text | notNull, default "bouquets" | enum: "bouquets", "arrangements", "plants", "gifts" |
| stock | integer | notNull, default 0 | |
| featured | integer (boolean) | default 0 | |
| createdAt | integer (timestamp) | default now | |

### Table: `cartItems`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | integer | PK, autoIncrement | |
| userId | integer | notNull, FK → users.id | |
| productId | integer | notNull, FK → products.id | |
| quantity | integer | notNull, default 1 | |
| createdAt | integer (timestamp) | default now | |

### Table: `orders`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | integer | PK, autoIncrement | |
| userId | integer | notNull, FK → users.id | |
| total | integer | notNull | in cents |
| status | text | notNull, default "pending" | enum: "pending", "processing", "shipped", "delivered", "cancelled" |
| createdAt | integer (timestamp) | default now | |

### Table: `orderItems`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | integer | PK, autoIncrement | |
| orderId | integer | notNull, FK → orders.id | |
| productId | integer | notNull, FK → products.id | |
| quantity | integer | notNull | |
| price | integer | notNull | snapshot price at order time, cents |

### Table: `contactMessages`
| Column | Type | Constraints | Notes |
|---|---|---|---|
| id | integer | PK, autoIncrement | |
| name | text | notNull | |
| email | text | notNull | |
| subject | text | | |
| message | text | notNull | |
| createdAt | integer (timestamp) | default now | |

## API Design (tRPC Routers + Zod)

### Auth Router (`api/routers/auth.ts`)
| Procedure | Type | Input (Zod) | Output | Auth | Description |
|---|---|---|---|---|---|
| `auth.register` | mutation | `{ name: z.string(), email: z.string().email(), password: z.string().min(6) }` | `{ token: string, user: User }` | public | Create local account, hash password with bcrypt, return JWT |
| `auth.login` | mutation | `{ email: z.string().email(), password: z.string() }` | `{ token: string, user: User }` | public | Verify password, return JWT |
| `auth.me` | query | — | `User \| null` | token | Return current user from JWT |
| `auth.logout` | mutation | — | `{ success: boolean }` | token | Invalidate client-side token |
| `auth.oauthCallback` | mutation | `{ code: z.string() }` | `{ token: string, user: User }` | public | Exchange OAuth code for token, create/update user |

### User Router (`api/routers/user.ts`)
| Procedure | Type | Input (Zod) | Output | Auth | Description |
|---|---|---|---|---|---|
| `user.list` | query | — | `User[]` | admin | List all users (admin only) |
| `user.updateRole` | mutation | `{ id: z.number(), role: z.enum(["user", "admin"]) }` | `User` | admin | Update user role |

### Product Router (`api/routers/product.ts`)
| Procedure | Type | Input (Zod) | Output | Auth | Description |
|---|---|---|---|---|---|
| `product.list` | query | `{ category?: z.string(), featured?: z.boolean() }` | `Product[]` | public | List products with optional filters |
| `product.getById` | query | `{ id: z.number() }` | `Product \| null` | public | Single product detail |
| `product.create` | mutation | `{ name, description, price, imageUrl, category, stock }` | `Product` | admin | Create new product |
| `product.update` | mutation | `{ id, ...partial fields }` | `Product` | admin | Update product |
| `product.delete` | mutation | `{ id: z.number() }` | `{ success: boolean }` | admin | Delete product |

### Cart Router (`api/routers/cart.ts`)
| Procedure | Type | Input (Zod) | Output | Auth | Description |
|---|---|---|---|---|---|
| `cart.get` | query | — | `{ items: CartItemWithProduct[] }` | token | Get current user's cart with product details |
| `cart.add` | mutation | `{ productId: z.number(), quantity: z.number().default(1) }` | `CartItem` | token | Add item to cart |
| `cart.update` | mutation | `{ itemId: z.number(), quantity: z.number() }` | `CartItem` | token | Update item quantity |
| `cart.remove` | mutation | `{ itemId: z.number() }` | `{ success: boolean }` | token | Remove item from cart |
| `cart.clear` | mutation | — | `{ success: boolean }` | token | Clear all cart items |

### Order Router (`api/routers/order.ts`)
| Procedure | Type | Input (Zod) | Output | Auth | Description |
|---|---|---|---|---|---|
| `order.create` | mutation | `{ items: z.array({ productId, quantity }) }` | `OrderWithItems` | token | Create order from cart, clear cart after |
| `order.list` | query | — | `Order[]` | token | List user's orders |
| `order.getById` | query | `{ id: z.number() }` | `OrderWithItems \| null` | token | Single order with items |
| `order.adminList` | query | — | `Order[]` | admin | List all orders (admin) |
| `order.updateStatus` | mutation | `{ id: z.number(), status: z.string() }` | `Order` | admin | Update order status |

### Contact Router (`api/routers/contact.ts`)
| Procedure | Type | Input (Zod) | Output | Auth | Description |
|---|---|---|---|---|---|
| `contact.create` | mutation | `{ name, email, subject, message }` | `ContactMessage` | public | Submit contact form |
| `contact.list` | query | — | `ContactMessage[]` | admin | List all messages (admin) |
| `contact.delete` | mutation | `{ id: z.number() }` | `{ success: boolean }` | admin | Delete message |

### AI Router (`api/routers/ai.ts`)
| Procedure | Type | Input (Zod) | Output | Auth | Description |
|---|---|---|---|---|---|
| `ai.chat` | mutation | `{ message: z.string(), history?: z.array({ role, content }) }` | `{ reply: string }` | public | Virtual receptionist chat — uses floral shop system prompt |

## Authentication Flow

### Dual Auth System
1. **OAuth 2.0 (Kimi)**:
   - User clicks "Continue with Kimi" → redirects to Kimi OAuth portal
   - Callback exchanges `code` for user info → creates/updates user in DB
   - Returns JWT token (httpOnly cookie + localStorage for tRPC)
   - `oauthProvider = "kimi"`, `oauthId` set from provider

2. **Username/Password (Local)**:
   - Registration: bcrypt.hash(password, 12) → store hash
   - Login: bcrypt.compare(password, hash) → return JWT
   - `passwordHash` set, `oauthProvider` null

### JWT Token
- Payload: `{ userId: number, email: string, role: string, iat: number, exp: number }`
- Expiration: 7 days
- Storage: localStorage `token` key
- tRPC client sends token in `Authorization: Bearer <token>` header

### Middleware
- `publicProcedure` — no auth required
- `authedProcedure` — validates JWT, sets ctx.user
- `adminProcedure` — validates JWT + role === "admin", returns 403 otherwise

### Role-Based Access
- Frontend: `useAuth()` hook returns `{ user, isAdmin, isLoading }`
- Admin routes guarded by `isAdmin` check, redirect to `/` if not admin
- Backend: All admin endpoints use `adminProcedure`

## Data Flow

### Guest → Customer Journey
1. Browse products (public `product.list`)
2. Add to cart → if not logged in, redirect to login
3. Login/Register → get JWT token
4. Cart operations (authed `cart.*`)
5. Checkout → create order (authed `order.create`)
6. Order confirmation

### Admin Journey
1. Login → token stored
2. Access `/admin` → frontend checks `isAdmin`
3. Dashboard stats → `user.list`, `order.adminList`, `product.list`
4. Manage products → `product.create/update/delete`
5. View orders → `order.adminList`, `order.updateStatus`
6. View messages → `contact.list`, `contact.delete`

## AI Virtual Receptionist

### System Prompt
"You are the Garden Guide for Velvet Rose, a luxury flower shop. You are warm, poetic, and knowledgeable about flowers. Help customers with: product recommendations, flower care tips, order inquiries, shop hours and location, and general floral knowledge. Keep responses concise (2-3 sentences), elegant, and botanical in tone. Always mention specific flower types when relevant."

### Implementation
- tRPC router `ai.chat` accepts message + optional conversation history
- Backend calls AI service with system prompt + user message
- Returns reply string
- Frontend maintains conversation history in component state
- No DB persistence for chat history

## Implementation Order
1. Initialize webapp + backend with auth features
2. Create database schema (`db/schema.ts`) + push
3. Seed products table with floral data
4. Implement auth router (register, login, me)
5. Implement product router (list, getById)
6. Build frontend pages (Home, Shop, Product)
7. Implement cart router + wire to frontend
8. Implement order router + checkout flow
9. Implement contact router + contact page + AI chat
10. Build admin dashboard with tables
11. Add admin middleware + route guards
12. Final polish, animations, cart flyout
