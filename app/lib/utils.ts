export function formatToWon(price:number):string {
    return price.toLocaleString('ko-KR')
}

export function formatToTimeAgo(date:string):string {
    //const dayInMs = 1000 * 60 * 60 * 24
    const dayInMs = 86400000
    const time = new Date(date).getTime()
    const now = new Date().getTime()
    const diff = Math.round((time - now) / dayInMs)
    console.log(time + " >> " + now + " >> " + diff)
    if(diff == 0)    return "오늘"
    else {
        const formatter = new Intl.RelativeTimeFormat("ko")
        return formatter.format(diff, "days")
    }
}