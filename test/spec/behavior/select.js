describe('iD.behaviorSelect', function() {
    var a, b, context, behavior, container;

    beforeEach(function() {
        container = d3.select('body').append('div');
        context = iD.Context().container(container);

        a = iD.Node({loc: [0, 0]});
        b = iD.Node({loc: [0, 0]});

        context.perform(iD.actionAddEntity(a), iD.actionAddEntity(b));

        container.call(context.map())
            .append('div')
            .attr('class', 'inspector-wrap');

        context.surface().select('.data-layer-osm').selectAll('circle')
            .data([a, b])
            .enter().append('circle')
            .attr('class', function(d) { return d.id; });

        context.enter(iD.modeBrowse(context));

        behavior = iD.behaviorSelect(context);
        context.install(behavior);
    });

    afterEach(function() {
        context.uninstall(behavior);
        context.mode().exit();
        container.remove();
    });

    specify('click on entity selects the entity', function() {
        happen.click(context.surface().selectAll('.' + a.id).node());
        expect(context.selectedIDs()).to.eql([a.id]);
    });

    specify('click on empty space clears the selection', function() {
        context.enter(iD.modeSelect(context, [a.id]));
        happen.click(context.surface().node());
        expect(context.mode().id).to.eql('browse');
    });

    specify('shift-click on unselected entity adds it to the selection', function() {
        context.enter(iD.modeSelect(context, [a.id]));
        happen.click(context.surface().selectAll('.' + b.id).node(), {shiftKey: true});
        expect(context.selectedIDs()).to.eql([a.id, b.id]);
    });

    specify('shift-click on selected entity removes it from the selection', function() {
        context.enter(iD.modeSelect(context, [a.id, b.id]));
        happen.click(context.surface().selectAll('.' + b.id).node(), {shiftKey: true});
        expect(context.selectedIDs()).to.eql([a.id]);
    });

    specify('shift-click on last selected entity clears the selection', function() {
        context.enter(iD.modeSelect(context, [a.id]));
        happen.click(context.surface().selectAll('.' + a.id).node(), {shiftKey: true});
        expect(context.mode().id).to.eql('browse');
    });

    specify('shift-click on empty space leaves the selection unchanged', function() {
        context.enter(iD.modeSelect(context, [a.id]));
        happen.click(context.surface().node(), {shiftKey: true});
        expect(context.selectedIDs()).to.eql([a.id]);
    });
});
