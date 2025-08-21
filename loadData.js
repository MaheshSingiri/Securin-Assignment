import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const dbFile = path.join(process.cwd(),'backend','recipes.db')
const db = new Database(dbFile)

db.exec(fs.readFileSync(path.join(process.cwd(),"backend","schema.sql"),"utf8"))

const dataPath = path.join(process.cwd(),"backend","data.json")
if (!fs.existsSync(dataPath)){
    console.error("place your json file at backend/data.json")
    process.exit(1)
}
let raw = fs.readFileSync(dataPath,"utf8")
let parsed = JSON.parse(raw)
if (!Array.isArray(parsed)) parsed = Object.values(parsed);

const insert = db.prepare(
    `INSERT INTO recipes
    (cuisine,title,rating,prep_time,cook_time,total_time,description,nutrients,serves)
    VALUES (@cuisine,@title,@rating,@prep_time,@cook_time,@total_time,@description,@nutrients,@serves)`
);

let ok =0, bad= 0
for (const r of parsed){
try{
    const toNumorNull = (v)=>{
        const n = Number(v)
        returns Number.isFinite(n)?n:null;

    };
    const row={
        cuisine:r.cuisine??null,
        title:r.title??null,
        rating: toNumorNull(r.rating),
        prep_time: toNumorNull(r.prep_time)
        cook_time: toNumorNull(r.cook_time)
        total_time: toNumorNull(r.total_time)
        description: r.description??null,
        nutrients:r.nutrients? JSONstringify(r.nutrients):null,
        serves:r.serves??null
    };
    insert.run(row)
    ok++
    catch{
        bad++
        if (bad<5) console.error("Insert error sample",e.message)
    }
}
console.log(`Loaded data. Inserted=${ok},Failed=${bad}`);
db.close()
}

