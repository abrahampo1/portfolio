import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class='sm:p-16 p-8 select-none'>
        <div>
          <p class="text-4xl tinos-regular">Abraham Leiro Fernández</p>
          <div class="flex items-center gap-2 tinos-regular-italic">
            <p>Senior Developer</p>
            <div class="w-[1px] bg-gray-500 h-4"></div>
            <a href="mailto:hola@leiro.dev">hola@leiro.dev</a>
            <div class="w-[1px] bg-gray-500 h-4"></div>
            <a href="https://github.com/abrahampo1">GitHub</a>
            <div class="w-[1px] bg-gray-500 h-4"></div>
            <a href="https://www.linkedin.com/in/abraham-leiro/">LinkedIn</a>
          </div>
        </div>
        <div class="mt-2">
          <p class="tinos-regular">A Software enthusiast with a commitment to continuous learning and improvement.</p>
        </div>
        <div class="mt-16">
          <p class="text-3xl tinos-regular">Portfolio</p>
          <div class="flex gap-2 flex-wrap justify-center md:justify-start mt-2">
            <Project projectName='Asoft' projectCharge='Full Stack Developer' projectUrlLabel='asoft.es' projectImage='https://www.asoft.es/asoft-logo.png' projectUrl='https://asoft.es' />
            <Project projectName='BloxyCorp' projectCharge='Full Stack Developer' projectUrlLabel='bloxycorp.com' projectUrl='https://bloxycorp.com' projectImage='https://www.bloxycorp.com/logo.svg' darkMode />
            <Project projectName='Tubuencamino' projectCharge='Full Stack Developer' projectUrlLabel='tubuencamino.com' projectUrl='https://tubuencamino.com' projectImage='https://tubuencamino.com/imagenes/logotipo/logo-tbc.compressed.png' />
            <Project projectName='Dr.Whisk3rs' projectCharge='Full Stack Developer' projectUrlLabel='drwhisk3rs.com' projectUrl='https://drwhisk3rs.com' projectImage='https://i.imgur.com/R8Wo52T.png' />
            <Project projectName='Pumm' projectCharge='Designer' projectUrl='https://pumm.io' projectUrlLabel='pumm.io' projectImage='https://pumm.io/assets/pummlogo.a0d7a614.png' />
            <Project projectName='Roam' projectCharge='Full Stack Developer' projectUrl='https://abrahampo1.github.io/roam/' projectUrlLabel='github.io/roam' projectImage='https://github.com/abrahampo1/roam/blob/master/src/image/logo.png?raw=true' />
          </div>
        </div>
        <div>

        </div>
      </div>
    </>
  )
}

function Project({
  projectName = 'Asoft',
  projectUrl = 'https://www.asoft.es/',
  projectImage = 'https://www.asoft.es/asoft-logo.png',
  projectUrlLabel = 'asoft.es',
  projectCharge = 'Full Stack Developer',
  darkMode = false
}) {
  return <>
    <div class={`h-[300px] w-full sm:w-[200px] border-black border-1 border-r-3 border-b-3 `}>
      <div className={`h-[200px] p-4 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <img className='w-full h-full aspect-square object-contain' src={projectImage} alt="" />
      </div>
      <div className='h-[100px] px-2 flex items-center'>
        <div class="tinos-regular">
          <p class="text-lg ">{projectName}</p>
          <p className='text-sm'>{projectCharge}</p>
          <a href={projectUrl} className='text-sm'>{projectUrlLabel}</a>
        </div>
      </div>
    </div>

  </>
}

export default App
