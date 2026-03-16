import { useState, useEffect } from 'react';
import axios from 'axios';
import GitHubStats from '../components/GithubStats';
import { Project } from '../components/Project';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://utils.leiro.dev/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <>
      <div className="mt-2">
        <p className="tinos-regular">A Software enthusiast with a commitment to continuous learning and improvement.</p>
      </div>
      <div className="mt-16">
        <p className="text-3xl tinos-regular">Portfolio</p>
        <div className="flex gap-2 flex-wrap justify-center md:justify-start mt-2">
          {loading ? (
            <p className="tinos-regular-italic">Loading projects...</p>
          ) : (
            projects.map((project) => (
              <Project
                key={project.id}
                projectName={project.name}
                projectCharge={project.charge}
                projectUrlLabel={project.url_label}
                projectImage={project.image}
                projectUrl={project.url}
                darkMode={project.dark_mode}
              />
            ))
          )}
        </div>
      </div>
      <GitHubStats />
    </>
  );
}
