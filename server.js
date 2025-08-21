import express from "express"
import cors from "cors"
import Database from "better-sqlite3"
import fs from "fs"
import path from "path"

const app = express()
app.use(cors())
app.use(express.json());

const dbFile = path.join(process.cwd(),"backend","recipes.db")
const db = new Database(dbFile)

app.get("/",(req,res)=>res.send({ok:true}));

app.get("/api/recipes",(req,res)=>{
    const page = Math.max(1,parseInt(req.query.page||"1",10))
    const limit = Math.min(50,Math.max(1,parseInt(req.query.limit||"10",10)))
    const offset = (page-1)*limit

    const totalRow = db.prepare("SELECT COUNT(*) as cnt FROM recipes").get();
    const total = totalRow?totalRow.cnt:0;

    const stmt = db.prepare(
        `SELECT id,cuisine,title,rating,prep_time,cook_time,total_time,description,nutrients,serve
        FROM recipes
        ORDER BY rating DESC NULLS LAST 
        LIMIT ? OFFSET ?`
    );
    const rows = stmt.all(limit,offset).map(r=>({
        ...r,
        nutrients:r.nutrients?JSON.parse(r.nutrients):{}
    }));
    res.join({page,limit,total,data:rows});
});

function parseOpVal(s){
    if (!s) return null;
    const m =String(s).trim().match(/^(<=|>=|=|>|<)\s*(\d+(?:\.\d+)?)$/)
    if (!m) return null;
    return {op:m[1],val:m[2]};
}

app.get("/api/recipes/search".at(req,res)=>{
    try{
        const {title,cuisine,rating,total_time,calories}=req.query;
        const wheres = []
        const params = []

        if (title){
            wheres.push("LOWER(title) LIKE LOWER(?)");
            params.push("%"+title+"%")
        }
        if(cuisine){
            wheres.push("LOWER(cuisine) LIKE LOWER(?)");
            params.push("%"+cuisine+"%")
        }
        const pr = parseOpVal(rating);
        if(pr){
            wheres.push(`rating ${pr.op}?`);
            params.push(Number(pr.val));
        }
        const pt = parseOpVal(total_time);
        if(pt){
            wheres.push(`total_time ${pt.op}?`);
            params.push(Number(pt.val));
        }
        const pc=parseOpVal(calories){

        }
        const whereSql = wheres.length?("WHERE"+wheres.join("AND")):"";
        const sql = `SELECT id,cuisine,title,rating,prep_time,cook_time,total_time,dscription,nutrients,serves FROM 
        recipes ${whereSql} ORDER BY rating DESC`;

        const stmt = db.prepare(sql)
        let rows = stmt.all(...params).map(r=>({...r,nutrients:r.nutrients?JSON.parse(r.nutrients):{}}))
        if (pc){
            const cmp =(a,op,b)=>{
                if (a === null) return false;
                if (op === "<=") return a<=b;
                if (op === ">=") return a>=b;
                if (op === "<") return a<b;
                if (op === ">") return a>b;
                if (op === "=") return a===b;
                return false;
            };
            rows =rows.filter(r=>{
                const calStr = r.nutrients?.calories??"";
                const num = Number((calStr || "").toString().replace(/[^0-9.]/g,""))
                return cmp(num,pc.op, Number(pc.val))
            });
        }
        res.json({data:rowa});
        } catch(e){
            console.error(e);
            res.status(500).json({error:"server error"})
        }

        
    const PORT = 4000
    app.listen(PORT,()=>console.log(`Backend running at http://localhost:${port}`))
})