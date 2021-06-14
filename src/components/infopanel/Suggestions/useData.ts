import { useEffect, useState } from "react";
import { useSetData } from "../../../hooks";

declare global {
    interface Window {
        GooglePlacesService: any;
    }
}

function getDetails(placeId: string): Promise<any> {
    return new Promise((res, rej) => {
      window.GooglePlacesService.getDetails({ placeId }, function(place: any, status: any) {
        if(status === 'OK') {
          res(place)
        }
        else if(status === 'NOT_FOUND' || status === 'ZERO_RESULTS') res([])
        else rej('ERROR OCCURED')
      })
    });
  }
  

export function useData() {
    const [placeId, setPlaceId] = useState<string>('')
    const { setPosition, setSuggestions, setCity } = useSetData()

    useEffect(() => {
        let mounted = false
        if(placeId) {
            getDetails(placeId)
            .then(value => {
                const { lat, lng } = value.geometry.location
                const country = value.address_components.find((address: any) => address.types.includes('country'))
                const city = value.address_components.find((address: any) => address.types.includes('locality') || address.types.includes('administrative_area_level_1'))
                setPosition([lat(), lng()])
                console.log(value)
                setSuggestions([])
                setCity(`${city?.long_name}, ${country?.long_name}`)
            })
            .catch(error => console.error(error.message))
        }
        return () => { mounted = true }
    }, [placeId])

    return { placeId, setPlaceId }
}