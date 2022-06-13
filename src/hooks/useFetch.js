import { useEffect, useState } from "react"

export const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(url)
            .then((response) => {
                if(!response.ok)
                    throw Error('Something went wrong')
                
                return response.json()
            })
            .then(data => {
                setData(data)
                setLoading(false)
                setError(null)
            })
            .catch(error => {
                setLoading(false)
                setError(error.message)
            })
    }, [])

    return { data, loading, error }
}