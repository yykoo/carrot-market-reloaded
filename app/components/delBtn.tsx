"use client"

import Swal from "sweetalert2"

const delBtnClick = (id:string) => {
    console.log(`Swal id:${id}`)
    Swal.fire({
        title: 'Are you delete?',
        text: 'Do not recovery',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if(result.isConfirmed) {
            goDeleteProduct(id)
        }
      })
}

const ReturnProtocol = {'response':'fail'}
type _returnProtocol = typeof ReturnProtocol

const goDeleteProduct = (id:string) => {
    const url = `/api?cmd=del&id=${id}`
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const ret = data as _returnProtocol

            if(ret.response == "ok") {
                Swal.fire({
                    title: 'Delete done',
                    text: '',
                    icon: 'success',
                    confirmButtonText: 'OK'
                  }).then((result) => {
                    location.href = "/"
                  })
            } else {
                Swal.fire({
                    title: 'Delete failed!!',
                    text: 'retry',
                    icon: 'error',
                    confirmButtonText: 'confirm'
                  }).then((result) => {
                    location.href = "/"
                  })
            }
        })
}

interface delProps {
    pid: string;
}

export default function DelBtn(props: delProps) {
    console.log(props)
    return (
        <button 
            className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
            onClick={() => { delBtnClick(props.pid) }} >
            Delete
        </button>
    )
}