import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ShoppingCart } from "lucide-react"
import { getPurchaseLinks } from "@/lib/mock-data"

interface PurchaseLinksProps {
  bookId: string
}

export default function PurchaseLinks({ bookId }: PurchaseLinksProps) {
  const purchaseLinks = getPurchaseLinks(bookId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-[#2A4759]">
          <ShoppingCart className="h-5 w-5 mr-2" />
          Where to Buy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {purchaseLinks.map((link, index) => (
          <Button key={index} variant="outline" className="w-full justify-between hover:bg-[#F2F2F2]" asChild>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              <span>{link.platform}</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ))}

        {purchaseLinks.length === 0 && (
          <div className="text-center text-gray-500 py-4">Purchase links not yet available</div>
        )}
      </CardContent>
    </Card>
  )
}
