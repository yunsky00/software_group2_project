function Layout({ header, children }) {
  return (
    <div className="app-shell">
      {header}
      <main className="app-main">{children}</main>
    </div>
  );
}

export default Layout;
