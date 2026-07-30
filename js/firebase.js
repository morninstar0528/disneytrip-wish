const appId=typeof __app_id!=='undefined'?__app_id:'mickey-trip-2026';
const localKey=name=>`disney-journey-${name}`;
const read=name=>JSON.parse(localStorage.getItem(localKey(name))||'[]');
const write=(name,rows)=>localStorage.setItem(localKey(name),JSON.stringify(rows));
class TripStore{
  async init(onState){
    this.onState=onState; onState('離線可用');
    try{
      const [{initializeApp},{getAuth,signInAnonymously},{getFirestore,collection,doc,setDoc,deleteDoc,onSnapshot,getDoc,getDocs}]=await Promise.all([
        import('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js'),import('https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js')]);
      const config=typeof __firebase_config!=='undefined'?JSON.parse(__firebase_config):{apiKey:'AIzaSyDRyZ4APvVvJ7jwxy2S8aqP9lIWmqjf7po',authDomain:'disneytrip-wish.firebaseapp.com',projectId:'disneytrip-wish',appId:'1:137088474334:web:dd46e5fa0eac4f0337364f'};
      this.db=getFirestore(initializeApp(config));this.api={collection,doc,setDoc,deleteDoc,onSnapshot,getDoc,getDocs};
      const auth=getAuth(),credential=await signInAnonymously(auth);this.uid=credential.user?.uid||auth.currentUser?.uid;if(!this.uid)throw new Error('Anonymous sign-in did not return a user');onState('雲端已同步');return true;
    }catch(_){this.db=null;this.api=null;this.uid=null;onState('離線可用');return false}
  }
  base(name){return this.api.collection(this.db,'artifacts',appId,'users',this.uid,name)}
  async put(name,id,data){const rows=read(name),next=[...rows.filter(x=>x.id!==id),{id,...data}];write(name,next);if(this.db)return this.api.setDoc(this.api.doc(this.base(name),id),data)}
  async remove(name,id){write(name,read(name).filter(x=>x.id!==id));if(this.db)return this.api.deleteDoc(this.api.doc(this.base(name),id))}
  watch(name,callback){if(!this.db){callback(read(name));return()=>{}}return this.api.onSnapshot(this.base(name),s=>{const rows=s.docs.map(d=>({id:d.id,...d.data()}));write(name,rows);callback(rows)},()=>callback(read(name)))}
  async one(name,id){if(!this.db)return read(name).find(x=>x.id===id)||null;const snap=await this.api.getDoc(this.api.doc(this.base(name),id));return snap.exists()?{id,...snap.data()}:read(name).find(x=>x.id===id)||null}
  async all(name){if(!this.db)return read(name);const snapshot=await this.api.getDocs(this.base(name));return snapshot.docs.map(d=>({id:d.id,...d.data()}))}
}
export const store=new TripStore();
