discovery.view.define('info-icon', function(el, config, data, context) {
    const { content } = config;

    this.tooltip(el, {
        showDelay: true,
        className: 'view-info-icon-tooltip',
        ...typeof content === 'object' && !Array.isArray(content) && !content.view
            ? content
            : { content }
    }, data, context);
});
