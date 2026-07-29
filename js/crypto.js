const encoder=new TextEncoder(), decoder=new TextDecoder();
const toB64=bytes=>btoa(String.fromCharCode(...bytes));
const fromB64=value=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
export const newSalt=()=>toB64(crypto.getRandomValues(new Uint8Array(16)));
export async function deriveKey(pin,salt){if(!/^\d{4}$/.test(pin))throw new Error('PIN 必須為 4 位數字');const material=await crypto.subtle.importKey('raw',encoder.encode(pin),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:fromB64(salt),iterations:210000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);}
export async function encrypt(value,key){const iv=crypto.getRandomValues(new Uint8Array(12));const encrypted=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,encoder.encode(JSON.stringify(value)));return{ciphertext:toB64(new Uint8Array(encrypted)),iv:toB64(iv),version:1};}
export async function decrypt(payload,key){const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:fromB64(payload.iv)},key,fromB64(payload.ciphertext));return JSON.parse(decoder.decode(plain));}
