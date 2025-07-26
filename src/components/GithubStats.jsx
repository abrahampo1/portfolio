import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GitHubStats = () => {
    const [commits, setCommits] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://utils.leiro.dev/totalCommits/abrahampo1');
                setCommits(response.data.total_commits);
            } catch (error) {
                console.error("Error fetching GitHub stats:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="mt-2 tinos-regular-italic" >Loading GitHub stats...</div>;
    }


    return (
        <div className="mt-2 tinos-regular-italic">
            <p>Total commits {commits.toLocaleString()}</p>
        </div>
    );
};

export default GitHubStats;