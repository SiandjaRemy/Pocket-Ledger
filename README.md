# 💰 Pocket Ledger

A simple, local-first, and offline-ready mobile app for tracking income and expenses within customizable groups. Built with Expo, Drizzle ORM, and TanStack Query.

## ✨ Features

- **Group Management:** Create and manage distinct "groups" or "ledgers" (e.g., 'Vacation 2025', 'Side Project', 'Household').
- **Transaction Tracking:** Log income (cash in) and expenses (cash out) with details like name, amount, source/reason, and date.
- **Combined Feed:** View a unified, date-sorted transaction history for each group, or see all recent transactions on the home screen.
- **Swipe Actions:**
  - **Deactivate/Reactivate:** Soft-deactivate groups to hide them from the main list without losing data.
  - **Delete:** Permanently delete a group and all its associated transactions.
- **Offline First:** All data is stored directly on your device using SQLite. The app works fully offline.
- **Modern Stack:** Built with a modern, type-safe, and performant tech stack.

---

## 🛠️ Tech Stack

- **Framework:** [Expo (React Native)](https://expo.dev/)
- **Routing:** [Expo Router](https://expo.github.io/expo-router/) (file-based)
- **Database:** [Expo-SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) (for type-safe SQL)
- **Data Fetching & State:** [TanStack Query](https://tanstack.com/query/latest) (for managing async DB operations)
- **UI/Styling:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **Gestures:** [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) (for swipe actions)
- **Animations:** [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version)
- `npm` or `yarn`
- [Expo] app on your iOS or Android device (for development)

### Installation & Running

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/SiandjaRemy/Pocket-Ledger.git](https://github.com/SiandjaRemy/Pocket-Ledger.git)
    cd PocketLedger
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the app:**

    ```bash
    npx expo start
    ```

4.  Scan the QR code with the Expo Go app on your phone.

The app automatically runs database migrations on the first launch using the `useMigrations` hook in `app/_layout.tsx`.

### Development (Making Schema Changes)

If you need to change the database schema (`db/schema.ts`):

1.  Modify the schema file.
2.  Run Drizzle Kit to generate a new migration file:
    ```bash
    npx drizzle-kit generate
    ```
3.  Re-run the app. The new migration will be applied automatically.

---

## 📁 Project Structure

```
.
├── app/              # Expo Router routes (all screens and layouts)
│   ├── (tabs)/       # Main tab navigator
│   │   ├── groups/   # Group list and detail screens
│   │   └── index.tsx # Home screen
│   └── _layout.tsx   # Root layout (with DB & Query providers)
│
├── db/               # Database logic
│   ├── api/          # Data-fetching functions (grouped by model)
│   ├── schema.ts     # Drizzle schema (table definitions)
│   └── index.ts      # `useDb` hook
│
├── drizzle/          # Auto-generated Drizzle migration files
│
├── hooks/            # Custom TanStack Query hooks (grouped by model)
│   └── groups/       # e.g., `useGetGroups`, `useAddGroup`
│
├── provider/         # React Context providers (e.g., QueryProvider)
│
├── types/            # Shared TypeScript type definitions
│
└── utils/            # Helper functions (e.g., `formatAmount`)
```

---

## 📄 License

This project is licensed under the MIT License.
