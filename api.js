const BASE = "http://localhost:400";

export async function fetchRecipes(page=1,limit=15) {
    const res = await fetch(`$BASE/api/recipes?page=${page}&limit=${limit}`)
    return res.json();
}
export async function searchRecipes(params){
    const qs = new URLSearchParams(params)
    const res = await fetch(`$BASE/api/recipes/search?${qs.toString()}`)
    return res.json()
}