export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-tm-dark flex items-center justify-center p-4"
         style={{backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(201,150,58,0.08) 0%, transparent 60%)'}}>
      {children}
    </div>
  )
}
