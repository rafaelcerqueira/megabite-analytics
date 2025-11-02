export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-pink-500"></div>
            <span className="ml-2 text-text-secondary">Carregando...</span>
        </div>
    );
}
