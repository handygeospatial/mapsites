require 'json'

print "var data = [\n"
rs = []
JSON.parse(open('data.geojson').read)['features'].each {|f|
  next if f['properties']['name'].nil?
  rs << 
    (f['geometry']['coordinates'].reverse << f['properties']['name']).inspect
}
print rs.join(', ')
print "];\n"
