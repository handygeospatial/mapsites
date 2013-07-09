require 'json'

print "var data = [\n"
rs = []
JSON.parse(open('data.geojson').read)['features'].each {|f|
  rs << 
    (f["geometry"]["coordinates"].reverse << f["properties"]["C09_002"]).inspect
}
print rs.join(', ')
print "];\n"
