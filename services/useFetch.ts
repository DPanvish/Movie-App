import {useEffect, useState} from "react";

/**
 * useFetch
 *
 * A tiny, reusable React hook to run an async function and track:
 * - data: the resolved value (or null before it arrives)
 * - loading: whether the request is in-flight
 * - error: a caught Error, if any
 * - refetch(): trigger the async function again on demand
 * - reset(): clear data/loading/error back to initial state
 *
 * Parameters
 * - fetchFunction: () => Promise<T>
 *   The async function you want to execute (e.g., a network request).
 * - autoFetch: boolean (default: true)
 *   If true, the hook will call fetchFunction once on mount.
 *
 * Typical usage
 * const { data, loading, error, refetch, reset } = useFetch(() => apiCall());
 *
 * Notes
 * - Errors are normalized to an Error instance for consistency.
 * - Use refetch() to manually run the request (useful for pull-to-refresh, retry, etc).
 * - Use reset() to clear previous results and start fresh.
 */
const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Performs the async operation and updates state accordingly.
    const fetchData = async () => {
        try{
            setLoading(true);
            setError(null);

            // Await the provided async function and store its result.
            const result = await fetchFunction();

            setData(result);
        }catch(error){
            // Ensure error state is always an Error instance with a readable message.
            setError(error instanceof Error ? error : new Error("An unknown error occurred"));
        }finally {
            // Always stop the loading indicator, whether it succeeded or failed.
            setLoading(false);
        }
    }

    // Reset all state back to initial values.
    const reset = () => {
        setData(null);
        setLoading(false);
        setError(null);
    }

    // Optionally auto-run once on mount (similar to "componentDidMount").
    useEffect(() => {
        if(autoFetch){
            fetchData()
        }
    }, []);

    // Expose state and helpers to the component.
    return {data, loading, error, refetch: fetchData, reset};
}

export default useFetch;