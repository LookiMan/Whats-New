
export function formatDate(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}.000Z`);
}

export function formatMessage(message: string): string {
    message += "\n\nДжерело: <a href='https://t.me/what_new_ua_bot'>What's New Ukraine Bot</a>"; 
    return message;
}
