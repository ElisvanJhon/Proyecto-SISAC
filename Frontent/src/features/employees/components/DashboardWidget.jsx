import React from 'react';

const DashboardWidget = ({ title, content, icon }) => {
  return (
    <div className="dashboard-widget">
      <div className="widget-header">
        {icon && <span className="widget-icon">{icon}</span>}
        <h3>{title}</h3>
      </div>
      <div className="widget-content">
        {content}
      </div>
    </div>
  );
};

export default DashboardWidget;