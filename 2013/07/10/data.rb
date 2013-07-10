require 'json'

json = JSON.parse(open('data.geojson').read);
dst_json = {}
%w{type copyright timestamp}.each {|k| dst_json[k] = json[k]}
dst_json['features'] = []
json['features'].each {|f|
  next unless (139.6..139.9).cover?(f['geometry']['coordinates'][0])
  next unless (35.6..35.8).cover?(f['geometry']['coordinates'][1])
  next if f['properties']['name'].nil?
  dst_json['features'] << {
    'type' => 'Feature',
    'properties' => {'name' => f['properties']['name']},
    'geometry' => f['geometry']
  }
}
open('data2.geojson', 'w') {|w|
  w.print JSON.generate(dst_json)
}

