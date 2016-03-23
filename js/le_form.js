function collect_data() {
    /*
    id_data_source
    id_publisher
    id_name_fi
    id_name_sv
    id_name_en
    id_short_description_fi
    id_short_description_sv
    id_short_description_en
    id_description_fi
    id_description_sv
    id_description_en
    id_info_url_fi
    id_info_url_sv
    id_info_url_en
    id_image
    id_start_time
    id_end_time
    id_offers-TOTAL_FORMS
    id_offers-0-is_free
    id_offers-0-price_fi
    id_offers-0-price_sv
    id_offers-0-price_en
    id_offers-0-description_fi
    id_offers-0-description_sv
    id_offers-0-description_en
    id_offers-0-info_url_fi
    id_offers-0-info_url_sv
    id_offers-0-info_url_en
    id_offers-0-id
    id_offers-0-event
    id_location_extra_info_fi
    id_location_extra_info_sv
    id_location_extra_info_en
    */
    var data = {};
    var languages = ["fi", "sv", "en"]; // TODO: from settings
    var translated_fields = [
        "name",
        "short_description",
        "description",
        "info_url",
        "location_extra_info"
    ];
    for (var i in translated_fields) {
        var fieldbase = translated_fields[i];
        data[fieldbase] = {};
        for (var j in languages) {
            var lang = languages[j];
            var fieldname = "#id_" + fieldbase + "_" + lang;
            data[fieldbase][lang] = $(fieldname).val();
        }
    }
    // capsulate fb/instgrm/twitter links in external links
    special_links = [
        ['Facebook', 'extlink_facebook'],
        ['Instagram', 'extlink_instagram'],
        ['Twitter', 'extlink_twitter'],
    ];
    data.external_links = {{ ext_links_without_special_links|safe }};
    for (var i in special_links) {
        var ext_key = special_links[i][0];
        var form_key = special_links[i][1];
        var form_val = $("#" + form_key).val();
        if (form_val) {
            link_data = {"name": ext_key, "link": form_val, "language": "en"};
            data.external_links.push(link_data);
        }
    }
    data.start_time = $("#id_start_time").val();
//    if (data.start_time) {
//        var parts = data.start_time.split(" ")
//        data.start_time = parts[0] + "T" + parts[1] + ":00"
//    }
    data.end_time = $("#id_end_time").val();
    data.image = $("#id_image").val();
    data.data_source = $("#id_data_source").val();
    data.publisher = $("#id_publisher").val();
    json = JSON.stringify(data);
    console.log(json);
    return data;
}
function has_errors(data) {
    var errors =[];
//    errors.push('data_source', 'data_source is missing or empty')
    // Require not empty data_source key
    if (!data.hasOwnProperty('data_source') || !data.data_source) {
        errors.push(['data_source', 'data_source is missing or empty'])
    }
    return errors;
}
function send_data(data) {
    // FIXME: check id from url
    if ("{{ event.pk }}") {
        put_data(data);
    } else {
        post_data(data);
    }
}
$.ajaxSetup({
    contentType : 'application/json',
    processData : false
});
function put_data(data) {
    json = JSON.stringify(data);
    $.ajax({
      method: "PUT",
      url: "/v0.1/event/{{ event.pk }}/",
      data: json
    })
    .error(function( e ) {
      alert( "Error: " + e.statusText );
    })
    .done(function( msg ) {
      alert( "Data Saved: " + msg );
    });
}
function post_data(data) {
    json = JSON.stringify(data);
    $.ajax({
      method: "POST",
      url: "/v0.1/event/",
      data: json
    })
    .error(function( e ) {
      alert( "Error in POST: " + e.responseJSON.non_field_errors );
    })
    .done(function( msg ) {
      alert( "Data Saved: " + msg );
    });
}

