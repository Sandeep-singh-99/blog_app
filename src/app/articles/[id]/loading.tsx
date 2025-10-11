import React from 'react'
import { BarLoader } from "react-spinners";
export default function ArticleLoading() {
  return (
    <div className='max-w-5xl mx-auto flex items-center mt-20'>
       <BarLoader width={"100%"} color="gray" className="my-4" />
    </div>
  )
}
