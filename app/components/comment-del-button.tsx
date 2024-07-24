"use client"

import { XMarkIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";

const ReturnProtocol = {'response':'fail', 'msg':''}
type _returnProtocol = typeof ReturnProtocol

const goDelCmmt = (cmmt_id:number) => {

    // TODO.
    const url = `/api?cmd=delcmmt&id=${cmmt_id}`
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const ret = data as _returnProtocol

            if(ret.response == "ok") {
                // Swal.fire({
                //     title: 'Delete done',
                //     text: '',
                //     icon: 'success',
                //     confirmButtonText: 'OK'
                //   }).then((result) => {
                //     location.href = location.href
                //   })
                location.href = location.href
            } else {
                Swal.fire({
                    title: 'Delete failed!!',
                    text: ret.msg,
                    icon: 'error',
                    confirmButtonText: 'confirm'
                  }).then((result) => {
                    console.log('delete failed')
                  })
            }
        })
}

const onDelClick = (cmmt_id:number) => {
    Swal.fire({
        title: '삭제 하시겠습니까?',
        text: 'Do not recovery',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if(result.isConfirmed) {
            goDelCmmt(cmmt_id)
        }
      })
}

export function CommentDelButton(props: {cmmtId:number}) {
    return (
        <XMarkIcon onClick={() => onDelClick(props.cmmtId)} className="ml-auto size-6 hover:bg-gray-600" /> 
    )
}
