import GitHubStats from '../components/GithubStats';
import { Project } from '../components/Project';

export default function HomePage() {
  return (
    <>
      <div className="mt-2">
        <p className="tinos-regular">A Software enthusiast with a commitment to continuous learning and improvement.</p>
      </div>
      <div className="mt-16">
        <p className="text-3xl tinos-regular">Portfolio</p>
        <div className="flex gap-2 flex-wrap justify-center md:justify-start mt-2">
          <Project projectName='Asoft' projectCharge='Full Stack Developer' projectUrlLabel='asoft.es' projectImage='https://www.asoft.es/asoft-logo.png' projectUrl='https://asoft.es' />
          <Project projectName='BloxyCorp' projectCharge='Full Stack Developer' projectUrlLabel='bloxycorp.com' projectUrl='https://bloxycorp.com' projectImage='https://www.bloxycorp.com/logo.svg' darkMode />
          <Project projectName='Tubuencamino' projectCharge='Full Stack Developer' projectUrlLabel='tubuencamino.com' projectUrl='https://tubuencamino.com' projectImage='https://tubuencamino.com/imagenes/logotipo/logo-tbc.compressed.png' />
          <Project projectName='Dr.Whisk3rs' projectCharge='Full Stack Developer' projectUrlLabel='drwhisk3rs.com' projectUrl='https://drwhisk3rs.com' projectImage='https://i.imgur.com/R8Wo52T.png' />
          <Project projectName='Pumm' projectCharge='Designer' projectUrl='https://pumm.io' projectUrlLabel='pumm.io' projectImage='https://pumm.io/assets/pummlogo.a0d7a614.png' />
          <Project projectName='Roam' projectCharge='Full Stack Developer' projectUrl='https://abrahampo1.github.io/roam/' projectUrlLabel='github.io/roam' projectImage='https://github.com/abrahampo1/roam/blob/master/src/image/logo.png?raw=true' />
          <Project projectName='TBI' projectUrlLabel='tbi-software.com' projectCharge='Full Stack Developer' projectImage='https://tbi-software.com/tbi-logo.png' projectUrl='https://tbi-software.com' />
          <Project projectName='Cannagest' projectCharge='Full Stack Developer' projectUrlLabel='cannagest.com' projectImage='https://www.asoft.es/asoft-logo.png' projectUrl='https://cannagest.com' />
          <Project projectName='CryptoGest' projectCharge='Full Stack Developer' projectUrlLabel='cryptogest.app' projectImage='https://cryptogest.app/images/logo.png' projectUrl='https://cryptogest.app' />
        </div>
      </div>
      <GitHubStats />
    </>
  );
}
