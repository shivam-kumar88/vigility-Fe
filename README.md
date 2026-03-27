### 1. Installation
Open a new terminal, navigate to the frontend directory, and install the required packages:
```bash
cd vigility-Fe
npm install
```

### 2. Environment Variables
Create a `.env.local` or `.env` file in the `frontend/` directory so the client knows how to communicate with the backend services:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api

```

### 3. Running the Development Server
Start the frontend application:
```bash
npm run dev
```

### 3. Running the Production Server
Start the frontend application:
```bash
npm run build

npm start
```

### 4. Stack/architectural choices 
* **Next.js:**  Best/fast react based frame work for Frontend project with the power of SSR and easy to work with typescript
* **ShadCN** Component are easy to implement for dashbord ui and lightwaight only import ui that you need 
* **Axios:** Industry stnderd and easy to use and manage over normet Fetch method


**Note** I am currently not using a global state management library like Redux/Zustand, as the application scales in complexity, I plan to integrate TanStack Query (React Query) for server-state caching and Redux Toolkit to handle complex client-side state.
