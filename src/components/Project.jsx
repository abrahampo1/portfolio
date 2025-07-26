export function Project({
  projectName = 'Asoft', projectUrl = 'https://www.asoft.es/', projectImage = 'https://www.asoft.es/asoft-logo.png', projectUrlLabel = 'asoft.es', projectCharge = 'Full Stack Developer', darkMode = false
}) {
  return <>
    <div className={`h-[300px] w-full sm:w-[200px] border-black border-1 border-r-3 border-b-3 `}>
      <div className={`h-[200px] p-4 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <img className='w-full h-full aspect-square object-contain' src={projectImage} alt="" />
      </div>
      <div className='h-[100px] px-2 flex items-center'>
        <div className="tinos-regular">
          <p className="text-lg ">{projectName}</p>
          <p className='text-sm'>{projectCharge}</p>
          <a href={projectUrl} className='text-sm'>{projectUrlLabel}</a>
        </div>
      </div>
    </div>
  </>;
}
