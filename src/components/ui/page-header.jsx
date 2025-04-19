/**
 * PageHeader component for consistent page headers
 */
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{title}</h1>
          {subtitle && <p className="text-lg text-gray-700">{subtitle}</p>}
        </div>
        {children && <div className="flex space-x-2">{children}</div>}
      </div>
    </div>
  )
}
