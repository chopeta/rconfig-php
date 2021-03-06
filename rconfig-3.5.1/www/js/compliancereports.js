$(document).ready(function () {
    if (location.href.match(/\error/)) {
        $('mainformDiv').show();
        $(".show_hide").show();


        // else run a default page load		
    } else {
        $(".mainformDiv").hide();
        $(".show_hide").show();

    }
    $('.show_hide').click(function () {
        $(".mainformDiv").toggle();
    });

});

// onsubmit to get all options from selectedPoliciesSel select box and post to CRUD
$('#reportsAddForm').submit(function () {
    // alert('Handler for .submit() called.');
    $("#selectedPoliciesSel option").prop('selected', true);
});

// next script is for row highlighting and selection of table rows	
$("#reportsTbl tbody tr").click(function (e) {
    var rowid = $(this).attr('setid');

    $("#reportsTbl tbody tr").removeClass("selected");
    var $checkbox = $(this).find(':checkbox');
    $("#reportsTbl :checkbox").not($checkbox).removeAttr("checked");
    if (e.target.type == "checkbox") {

        // stop the bubbling to prevent firing the row's click event
        e.stopPropagation();
        $(this).filter(':has(:checkbox)').toggleClass('selected', $checkbox.attr('checked'));
    } else {
        $checkbox.attr('checked', !$checkbox.attr('checked'));
        $(this).filter(':has(:checkbox)').toggleClass('selected', $checkbox.attr('checked'));
    }
});

function delReport() {
    var rowid = $("input:checkbox:checked").attr("id")
    if (rowid) {
        var answer = confirm("Are you sure you want to remove this Report?")
        if (answer) {
            $.post('lib/crud/compliancereports.crud.php', {
                id: rowid,
                del: "delete"
            }, function (result) {
                if (result.success) {
                    window.location.reload(); // reload the user current page
                } else {
                    window.location.reload();
                }
            }, 'json');
        } else {
            window.location.reload();
        }
    } else {
        alert("Please select a Report to delete!")
    }
}

function editReport() {

    var getRow = "getRow"
    var rowid = $("input:checkbox:checked").attr("id")
    if (rowid) {
        $.ajaxSetup({cache: false});
        $.getJSON("lib/crud/compliancereports.crud.php?id=" + rowid + "&getRow=" + getRow, function (data) {
            //loop through all items in the JSON array  
            $.each(data.rows, function (i, data) {
                var reportsName = data.reportsName
                var reportsDesc = data.reportsDesc
                if (reportsName) {
                    if ($('.mainformDiv').is(':hidden')) {
                        $('.mainformDiv').slideToggle();
                    }
                    $('input[name="reportsName"]').val(reportsName)
                    $('input[name="reportsDesc"]').val(reportsDesc)
                    $.ajaxSetup({ cache: false });
                    // populate the selected box with this Report IDs elements
                    $.getJSON("lib/ajaxHandlers/ajaxGetPolicyPolicies.php?id=" + rowid, function (data) {
                        selectedOptions = data
                        $('#selectedPoliciesSel')[0].options.length = 0; // clear the box of existing values
                        $("#selectedPoliciesSel").append(selectedOptions); // append the html
                    });

                    $('input[name="editid"]').val(rowid) // used to populate id input so that edit script will insert
                } else {
                    alert("Could not load data");
                }
                $(".show_hide").show(); // show show_hide class 
            });
        });
    } else {
        alert("Please select a Report to edit!")
    }
}

// from http://www.johnwbartlett.com/cf_tipsntricks/index.cfm?TopicID=86
function SelectMoveRows(SS1, SS2)
{
    var SelID = '';
    var SelText = '';
    // Move rows from SS1 to SS2 from bottom to top
    for (i = SS1.options.length - 1; i >= 0; i--)
    {
        if (SS1.options[i].selected == true)
        {
            SelID = SS1.options[i].value;
            SelText = SS1.options[i].text;
            var newRow = new Option(SelText, SelID);
            SS2.options[SS2.length] = newRow;
            SS1.options[i] = null;
        }
    }
    SelectSort(SS2);
}

function SelectSort(SelList)
{
    var ID = '';
    var Text = '';
    for (x = 0; x < SelList.length - 1; x++)
    {
        for (y = x + 1; y < SelList.length; y++)
        {
            if (SelList[x].text > SelList[y].text)
            {
                // Swap rows
                ID = SelList[x].value;
                Text = SelList[x].text;
                SelList[x].value = SelList[y].value;
                SelList[x].text = SelList[y].text;
                SelList[y].value = ID;
                SelList[y].text = Text;
            }
        }
    }
}

// default back to no GETs or POSTS when click i.e. default devices page
function clearSearch() {
    window.location = "compliancereports.php"
}
