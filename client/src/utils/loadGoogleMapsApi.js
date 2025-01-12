export const loadGoogleMapsApi = () => {
    const GOOGLE_MAPS_API_KEY = 'AIzaSyA5piHGoJrVT5jKhaVezZUwOoPUAAYQcJs';
    
    return new Promise((resolve, reject) => {
        if (window.google) {
            resolve(window.google);
            return;
        }

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry,drawing,places`;
        script.async = true;
        script.defer = true;
        
        script.addEventListener('load', () => {
            resolve(window.google);
        });
        
        script.addEventListener('error', (error) => {
            reject(error);
        });
        
        document.head.appendChild(script);
    });
};