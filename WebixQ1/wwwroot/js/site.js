webix.ready(async function () {
    createApp();    
});

async function createApp() {
    let dataTableId = 'main-data-table';
    let editWinId = 'main-edit-win';
    let editFormId = 'main-edit-form';

    onClick = getOnClick(editWinId);

    webix.ui({
        rows: [
            {
                view: "toolbar",
                cols: [
                    {
                        view: "button", value: "Add...", width: 150,
                        click: () => {
                            $$(dataTableId).clearSelection();
                            $$(editWinId).show();
                        }
                    }
                ]
            },
            {
                view: "datatable",
                id: dataTableId,
                select: "row",                
                columns: [
                    { id: "id", width: 150 },
                    { id: "lastName", width: 200 },
                    { id: "firstName", width: 200 },
                    { template: "<span class='webix_icon wxi-pencil edit_row'></span>", width: 45, resize: false, tooltip: "Edit" },
                    { template: "<span class='webix_icon wxi-trash delete_row'></span>", width: 45, resize: false, tooltip: "Delete" }
                ],
                url: "/Home/Users",
                save: {
                    insert: function (id, operation, update) {
                        return webix.ajax()
                            .post("/Home/UserCreate", update)
                            .then(function (data) {
                                data = data.json();
                                if (data.errors !== "") {
                                    webix.message({ text: data.errors, type: "error" });

                                    // Not insert new string in DataTable!
                                }
                                else {
                                    let newId = data.newId;

                                    // Set newId to the row just inserted, and select them
                                }
                            }).fail(() => {
                                webix.message({ text: "Error adding new record!", type: "error" });

                                // Not insert new string in DataTable!
                            });
                    },
                    update: function (id, operation, update) {
                        return webix.ajax()
                            .post("/Home/UserUpdate", update)
                            .then(function (data) {
                                data = data.json();
                                if (data.errors !== "") {
                                    webix.message({ text: data.errors, type: "error" });

                                    // Not update selected string in DataTable!
                                }
                            }).fail(() => {
                                webix.message({ text: "Error updating record!", type: "error" });

                                // Not update selected string in DataTable!
                            });
                    },
                    delete: function (id, operation, update) {
                        return webix.ajax()
                            .post("/Home/DeleteUpdate", id)
                            .then(function (data) {
                                data = data.json();
                                if (data.errors !== "") {
                                    webix.message({ text: data.errors, type: "error" });

                                    // Row should NOT be removed from the DataTable!
                                }
                            }).fail(() => {
                                webix.message({ text: "Error updating record!", type: "error" });

                                // Row should NOT be removed from the DataTable!
                            });
                    }
                },
                onClick: onClick
            }
        ]
    });    

    createEditWindow(editWinId, editFormId);
    $$(editFormId).bind($$(dataTableId));
}

function getOnClick(editWinId) {
    return {
        "edit_row": function () {
            $$(editWinId).show();
        },
        "delete_row": function (ev, id) {
            let that = this;
            let rowId = id;
            webix.confirm({
                title: "Confirm",
                text: "Delete selected row?",
                ok: "Yes",
                cancel: "Cancel",
                type: "confirm-warning"
            }).then(function () {
                that.remove(rowId)
            }).fail(function () { });
        }
    };
}

function createEditWindow(editWinId, editFormId) {
    webix.ui({
        view: "window",
        id: editWinId,
        width: 550,
        head: "Edit",
        modal: true,
        position: "center",
        body: {
            view: "form",
            id: editFormId,
            elements: [
                { view: "text", label: "Id:", name: "id", readonly: true },
                { view: "text", label: "LastName:", name: "lastName" },
                { view: "text", label: "FirstName:", name: "firstName" },
                {
                    cols: [
                        {
                            view: "button", value: "Cancel", click: function () {
                                this.getTopParentView().hide();
                            }
                        },
                        {
                            view: "button", type: "form", value: "Save", css: "webix_primary", click: function () {
                                if (this.getFormView().validate()) {
                                    this.getFormView().save();
                                    this.getTopParentView().hide();
                                }
                            }
                        }
                    ]
                }
            ],
            elementsConfig: {
                labelPosition: "left",
                labelAlign: "right",
                labelWidth: 120
            }
        }
    });
}