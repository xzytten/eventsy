import { type FC } from 'react'
import { router } from '@/routes/router'
import { RouterProvider } from 'react-router-dom'
import "@/styles/index.css";

const App: FC = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
