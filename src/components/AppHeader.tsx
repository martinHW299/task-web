type Props = {
  apiBaseUrl: string;
  loading: boolean;
  onCreate: () => void;
  onRefresh: () => void;
};

export function AppHeader({ apiBaseUrl, loading, onCreate, onRefresh }: Props) {
  return (
    <header className="appHeader">
      <div className="appTopBar">
        <div className="appTopBarTitle">
          <h1 className="appTitle">Tasks</h1>
          <p className="appSubTitle">
            API: <code className="appCode">{apiBaseUrl}/tasks</code>
          </p>
        </div>

        <div className="appHeaderActions">
          <button type="button" className="taskButton taskButtonPrimary" onClick={onCreate} disabled={loading}>
            + New task
          </button>
          <button type="button" className="taskButton" onClick={onRefresh} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}
