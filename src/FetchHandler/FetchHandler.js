class FetchHandler{
    static async queryData(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Fetch request failed');
            }
            return await response.json();
        } catch (error) {
            
            throw error
        }
    }
}