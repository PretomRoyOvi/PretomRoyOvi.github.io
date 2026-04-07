/**
 * Navbar - UNT logo, PRISM Lab brand, nav links (two-row layout)
 * Research has a dropdown with subsections.
 * Brand text: "Dr. Pretom Roy Ovi" on Home, "PRISM Lab" on other pages.
 * Nav items come from /api/site (admin-controlled).
 */
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useHomeController } from '../../controllers/useHomeController.js';
import { usePrismLabController } from '../../controllers/usePrismLabController.js';
import { useContactController } from '../../controllers/useContactController.js';
import { useSiteController } from '../../controllers/useSiteController.js';
import './Navbar.css';
import { publicAsset } from '../../utils/publicAsset.js';

const LOGO_URL = publicAsset('unt-lettermark-eagle-logo.svg');

function NavItem({ item, flattenDropdown = false }) {
  const hasChildren = item.children && item.children.length > 0;
  const [open, setOpen] = useState(false);

  if (hasChildren && flattenDropdown) {
    return (
      <>
        <NavLink
          to={item.path}
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          end={item.path === '/'}
        >
          {item.label}
        </NavLink>
        {item.children.map((child) => (
          <NavLink
            key={child.id}
            to={child.path}
            className={({ isActive }) => 'nav-link nav-link--sub' + (isActive ? ' active' : '')}
            end={child.path === item.path}
          >
            {child.label}
          </NavLink>
        ))}
      </>
    );
  }

  if (hasChildren) {
    return (
      <div
        className="nav-item nav-item-dropdown"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <NavLink to={item.path} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
          {item.label}
          <span className="nav-chevron" aria-hidden>▼</span>
        </NavLink>
        <ul className={`dropdown ${open ? 'open' : ''}`}>
          {item.children.map((child) => (
            <li key={child.id}>
              <NavLink
                to={child.path}
                className={({ isActive }) => 'dropdown-link' + (isActive ? ' active' : '')}
                end={child.path === item.path}
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
      end={item.path === '/'}
    >
      {item.label}
    </NavLink>
  );
}

const NAV_MOBILE_MQ = '(max-width: 900px)';

export default function Navbar() {
  const { pathname } = useLocation();
  const { data: homeData } = useHomeController();
  const { data: prismData } = usePrismLabController();
  const { data: contactData } = useContactController();
  const { navbar } = useSiteController();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(NAV_MOBILE_MQ);
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isNarrow) setMobileOpen(false);
  }, [isNarrow]);

  const isHome = pathname === '/' || pathname === '' || pathname === '/index.html';
  // Home page: professor name from Home content; other pages: lab name from PRISM Lab content
  const brandText = isHome
    ? (homeData?.title ?? contactData?.name ?? contactData?.lab ?? 'Mention place please')
    : (prismData?.title ?? 'PRISM Lab');

  return (
    <header className="navbar">
      <div className={`navbar-inner${mobileOpen && isNarrow ? ' navbar-inner--menu-open' : ''}`}>
        <a href="/" className="navbar-logo-wrap" aria-label="UNT Home">
          <img src={LOGO_URL} alt="UNT" className="navbar-logo" />
        </a>
        <div className="navbar-title-wrap">
          <span className="navbar-vline" aria-hidden />
          <span className="navbar-brand">{brandText}</span>
        </div>
        <button
          type="button"
          className="navbar-menu-toggle"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="primary-navigation"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="navbar-menu-toggle-visual" aria-hidden>{mobileOpen ? '×' : '☰'}</span>
        </button>
        <nav
          id="primary-navigation"
          className={`nav${isNarrow && mobileOpen ? ' nav--open' : ''}${isNarrow ? ' nav--mobile' : ''}`}
        >
          {Array.isArray(navbar) && navbar.map((item) => (
            <NavItem key={item.id} item={item} flattenDropdown={isNarrow} />
          ))}
        </nav>
      </div>
      <div className="navbar-line" aria-hidden />
    </header>
  );
}
