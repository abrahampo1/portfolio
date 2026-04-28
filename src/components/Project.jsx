import { Link } from 'react-router-dom';

export function Project({
  projectName = 'Asoft', projectUrl = 'https://www.asoft.es/', projectImage = 'https://www.asoft.es/asoft-logo.png', projectUrlLabel = 'asoft.es', projectCharge = 'Full Stack Developer', darkMode = false, internal = false,
}) {
  const Anchor = internal
    ? ({ children, ...props }) => <Link to={projectUrl} {...props}>{children}</Link>
    : ({ children, ...props }) => <a href={projectUrl} {...props}>{children}</a>;

  return (
    <div className={`h-[300px] w-full sm:w-[200px] border-black border-1 border-r-3 border-b-3 `}>
      <div className={`h-[200px] p-4 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <img className='w-full h-full aspect-square object-contain' src={projectImage} alt="" onError={(e) => { e.target.onerror = null; e.target.src = 'https://www.asoft.es/asoft-logo.png'; }} />
      </div>
      <div className='h-[100px] px-2 flex items-center'>
        <div className="tinos-regular">
          <p className="text-lg ">{projectName}</p>
          <p className='text-sm'>{projectCharge}</p>
          <Anchor className='text-sm'>{projectUrlLabel}</Anchor>
        </div>
      </div>
    </div>
  );
}
