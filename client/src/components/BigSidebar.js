import { useAppContext } from '../context/appContext';
import NavLinks from './NavLinks';
import Logo from '../components/Logo';
import Wrapper from '../assets/wrappers/BigSidebar';

const BigSidebar = () => {
  const {showSidebar,toggleSidebar}=useAppContext()
  return (
    <Wrapper>
      <div className={showSidebar?'sidebar-container':'sidebar-container show-sidebar'}>
        <div className='content'>
          <header>
            <Logo/>
          </header>
{/*   toggleSidebar={toggleSidebar} you can if needed of you want to close on redirect       */}
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  )
}

export default BigSidebar