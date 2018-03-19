const results = [
  {
    "id": 1,
    "addressId": 1,
    "title": "1",
    "latitude": 39.86143909,
    "longitude": -105.00939761,
    "pLat": 39.86156813,
    "pLng": -105.00948655
  },
  {
    "id": 1,
    "addressId": 1,
    "title": "1",
    "latitude": 39.86143909,
    "longitude": -105.00939761,
    "pLat": 39.86156892,
    "pLng": -105.00930662
  },
  {
    "id": 1,
    "addressId": 1,
    "title": "1",
    "latitude": 39.86143909,
    "longitude": -105.00939761,
    "pLat": 39.86130926,
    "pLng": -105.00930867
  },
  {
    "id": 1,
    "addressId": 1,
    "title": "1",
    "latitude": 39.86143909,
    "longitude": -105.00939761,
    "pLat": 39.86130926,
    "pLng": -105.0094886
  },
  {
    "id": 2,
    "addressId": 1,
    "title": "2",
    "latitude": 39.86143951,
    "longitude": -105.00921071,
    "pLat": 39.86156854,
    "pLng": -105.00929965
  },
  {
    "id": 2,
    "addressId": 1,
    "title": "2",
    "latitude": 39.86143951,
    "longitude": -105.00921071,
    "pLat": 39.86156933,
    "pLng": -105.00911972
  },
  {
    "id": 2,
    "addressId": 1,
    "title": "2",
    "latitude": 39.86143951,
    "longitude": -105.00921071,
    "pLat": 39.86130968,
    "pLng": -105.00912177
  },
  {
    "id": 2,
    "addressId": 1,
    "title": "2",
    "latitude": 39.86143951,
    "longitude": -105.00921071,
    "pLat": 39.86130968,
    "pLng": -105.00930171
  }
]

const grouped = results.reduce(function (rv, x) { 
  let el = rv.find((r) => r && r.id === x.id); 
  console.log(x)
  if (el) { el.polygon.push({latitude:x.pLat, longitude:x.pLng}); } 
  else { rv.push({ 
    id: x.id,
    title: x.title,
    latitude: x.latitude,
    longitude: x.longitude,
    polygon: [{latitude:x.pLat, longitude:x.pLng}] 
  }); } 
  return rv; 
}, []); 

console.log(JSON.stringify(grouped))