/*/app/blogs/page.tsx */
import BlogsPage from '@/components/blogs/BlogsPage'
import { Navbar } from '@/components/navbar/Navbar'
import React from 'react'

const Blogs = () => {
  return (
    <>
    <Navbar/>
   <BlogsPage/>
   </>
  )
}

export default Blogs